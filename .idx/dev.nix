# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11";

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.zulu
    # Add Python with the specific packages required by apphosting.yaml
    (pkgs.python311.withPackages (ps: [
      ps.fastapi
      ps.uvicorn
      ps.python_dotenv
      ps.google_cloud_firestore
      ps.firebase_admin
      ps.gunicorn
    ]))
  ];

  # Sets environment variables in the workspace
  env = {};

  idx = {
    # Add a web preview configuration
    previews = {
      enable = true;
      previews = [
        {
          id = "web";
          manager = "web";
          # Use the dev script from your package.json
          command = [ "bash" "-lc" "npm run dev" ];
          env = { };
        }
      ];
    };

    # The list of extensions to recommend VS Code users.
    extensions = [
      "ms-python.python"
      "ms-python.debugpy"
    ];
  };
}
