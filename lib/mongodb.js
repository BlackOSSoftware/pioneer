import dns from "node:dns";
import mongoose from "mongoose";

/**
 * Windows / some ISP DNS resolvers return querySrv ECONNREFUSED for mongodb+srv.
 * Force public DNS so Atlas SRV lookups work for the whole app (login, CMS, forms).
 */
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
  if (typeof dns.setDefaultResultOrder === "function") {
    dns.setDefaultResultOrder("ipv4first");
  }
} catch {
  // ignore if environment disallows changing resolvers
}

let connectingPromise = null;

/**
 * Expand mongodb+srv:// → mongodb:// host list (fallback if SRV still fails).
 */
async function expandSrvConnectionString(uri) {
  if (!uri.startsWith("mongodb+srv://")) return uri;

  const withoutProtocol = uri.slice("mongodb+srv://".length);
  const at = withoutProtocol.lastIndexOf("@");
  if (at < 0) return uri;

  const auth = withoutProtocol.slice(0, at);
  const rest = withoutProtocol.slice(at + 1);
  const slash = rest.indexOf("/");
  const q = rest.indexOf("?");
  let host = rest;
  let path = "/";
  let search = "";

  if (slash >= 0) {
    host = rest.slice(0, slash);
    const after = rest.slice(slash);
    const q2 = after.indexOf("?");
    if (q2 >= 0) {
      path = after.slice(0, q2) || "/";
      search = after.slice(q2 + 1);
    } else {
      path = after || "/";
    }
  } else if (q >= 0) {
    host = rest.slice(0, q);
    search = rest.slice(q + 1);
  }

  const hostOnly = host.split(":")[0];
  const { Resolver } = await import("node:dns/promises");
  const resolver = new Resolver();
  resolver.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

  const records = await resolver.resolveSrv(`_mongodb._tcp.${hostOnly}`);
  const txtRows = await resolver.resolveTxt(hostOnly).catch(() => []);
  const txt = txtRows.flat().join("");

  const hosts = records
    .map((r) => `${r.name}:${r.port || 27017}`)
    .join(",");

  const params = new URLSearchParams(search);
  params.set("tls", "true");
  params.set("ssl", "true");
  if (!params.has("retryWrites")) params.set("retryWrites", "true");
  if (!params.has("w")) params.set("w", "majority");

  const rs = txt.match(/replicaSet=([^&]+)/);
  if (rs && !params.has("replicaSet")) params.set("replicaSet", rs[1]);
  const as = txt.match(/authSource=([^&]+)/);
  if (as && !params.has("authSource")) params.set("authSource", as[1]);

  return `mongodb://${auth}@${hosts}${path.startsWith("/") ? path : `/${path}`}?${params.toString()}`;
}

async function connectWithUri(uri) {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 12000,
    connectTimeoutMS: 12000,
    family: 4,
  });
}

/**
 * Shared Mongo connection for login, CMS, forms, etc.
 */
export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (connectingPromise) {
    return connectingPromise;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  connectingPromise = (async () => {
    try {
      try {
        await connectWithUri(uri);
      } catch (firstErr) {
        const msg = String(firstErr?.message || firstErr);
        if (uri.startsWith("mongodb+srv://") && /querySrv|ECONNREFUSED|ENOTFOUND/i.test(msg)) {
          const expanded = await expandSrvConnectionString(uri);
          await connectWithUri(expanded);
        } else {
          throw firstErr;
        }
      }
    } catch (error) {
      throw new Error(`MongoDB connection failed: ${error.message}`);
    } finally {
      connectingPromise = null;
    }
  })();

  return connectingPromise;
}
