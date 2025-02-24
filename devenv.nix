{pkgs, ...}: {
  cachix.enable = false;

  languages.javascript = {
    enable = true;
    directory = "./app";
    package = pkgs.nodejs-slim;
    pnpm = {
      enable = true;
      install.enable = true;
    };
  };

  packages = [pkgs.git];
}
