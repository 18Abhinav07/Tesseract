import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @polkadot bundles contain `\00` octal escapes inside template literals which
  // Turbopack's SSR bundler rejects (strict-mode parse error). Mark them external
  // so Node.js loads the CJS bundles natively and bypasses the bundler.
  serverExternalPackages: [
    // @polkadot packages — contain octal escape sequences in CJS bundles which Turbopack
    // rejects in strict mode. Mark external so Node.js loads them natively as CJS.
    "@polkadot/api",
    "@polkadot/util-crypto",
    "@polkadot/util",
    "@polkadot/types",
    "@polkadot/rpc-provider",
    "@polkadot/rpc-core",
    "@polkadot/api-base",
    "@polkadot/types-known",
    "@polkadot/keyring",
    // WASM bridge packages — contain octal escapes + WASM blobs; must not be SSR-bundled
    "@polkadot/wasm-bridge",
    "@polkadot/wasm-crypto",
    "@polkadot/wasm-crypto-asmjs",
    "@polkadot/wasm-crypto-wasm",
    "@polkadot/wasm-crypto-init",
    // ParaSpell SDK — also contains octal escapes via its @polkadot transitive deps
    "@paraspell/sdk-pjs",
  ],
  trailingSlash: true,
};

export default nextConfig;
