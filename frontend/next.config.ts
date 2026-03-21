import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  transpilePackages: [
    "@polkadot/wasm-crypto",
    "@polkadot/wasm-crypto-wasm",
    "@polkadot/wasm-crypto-asmjs",
    "@polkadot/wasm-bridge"
  ],
  webpack: (config) => {

    config.optimization.splitChunks = false;
    // @polkadot/wasm-crypto embeds WASM binary as a base64 string inside a template literal.
    // That string contains octal escape sequences (\077, etc.) which are illegal in template
    // literals under strict mode — including when Talisman wallet's SES (lockdown-install.js)
    // hardens the environment before your app chunks load.
    //
    // @babel/plugin-transform-template-literals converts template literals to regular string
    // concatenation, which permits octal sequences and resolves the SyntaxError.
    config.module.rules.push({
      test: /\.(js|mjs)$/,
      include: /node_modules\/@polkadot\/(wasm-crypto|wasm-crypto-wasm|wasm-crypto-asmjs|wasm-bridge)/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["next/babel"],
          plugins: ["@babel/plugin-transform-template-literals"],
        },
      },
    });

    return config;
  },
};

export default nextConfig;