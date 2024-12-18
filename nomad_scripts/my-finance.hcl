job "my-finance" {
  group "myfinance-app" {
    count = 1

    network {
      port "http" {
        static = 8080
        to = 3000
      }
    }

    task "web" {  
      driver = "docker"

      config {
        image = "registry.bosswatchtower.com/finance:latest"

        ports = ["http"]
        
        volumes = ["${path.root}/api/storage:/rails/storage"]

        args = ["server"]
        command = "rails"

        logging {
          type = "journald"
          config {
            tag = "MYFINANCE-APP"
          }
        }
      }


      resources {
        cpu    = 300
        memory = 512
      }

      env {
        RAILS_ENV = "production"
      }

      service {
        name = "finance-app"
        port = "http"

        check {
          name     = "alive"
          type     = "tcp"
          port     = "http"
          interval = "10s"
          timeout  = "2s"
        }
      }
    }
  }
}