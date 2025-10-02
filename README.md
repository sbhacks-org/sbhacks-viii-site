# SBHacks VIII Site

## how 2 run

Due to strange issues with Node, the codebase of this website is completely
cooked. What has been done to it subsequently is akin to the USSR embalming
Stalin's corpse and putting him on display posthumously, that is, you should
not expect to obtain anything useful from this codebase. It is purely on
display now.

So how do you build it? I highly recommend you do not interact with it using
`npm` directly anymore due to issues with the cryptography library in node and
build issues with `node-sass`. Instead, you should install the [Nix package
manager](https://nixos.org/), available for Linux and macOS (not Windows),
which will provide its own `node` and `pnpm` binaries that are correctly
configured to build the project.

Once Nix is installed, it's as simple as:

```sh
nix build
```

The website contents will be made available in `result`. You can deploy this
using a standard webserver like `nginx` or `apache`.
