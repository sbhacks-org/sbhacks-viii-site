{
  stdenv,
  nodejs_20,
  pnpm,
}:
stdenv.mkDerivation (finalAttrs: {
  pname = "sbhacks-2022-website";
  version = "0-unstable-2025-10-02";

  src = ./.;

  nativeBuildInputs = [
    nodejs_20
    pnpm.configHook
  ];

  pnpmDeps = pnpm.fetchDeps {
    inherit (finalAttrs) pname version src;
    fetcherVersion = 2;
    hash = "sha256-4DYrp7KF4/rhmSQP2b2onXsorZhHGoKL4hC3G7SSRnE=";
  };

  NODE_OPTIONS = "--openssl-legacy-provider";

  buildPhase = ''
    pnpm build
  '';

  installPhase = ''
    mkdir -p $out
    cp -r build/* $out
  '';
})
