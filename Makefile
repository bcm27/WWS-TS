.PHONY: help dev prod build test clean install lint logs status restart stop

help: ## Show this help message
	@echo "Hardwood Species Selector - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start development environment
	@./scripts/start-dev.sh

prod: ## Deploy to production
	@./scripts/deploy-prod.sh

build: ## Build the application
	@npm run build

build-docker: ## Build Docker images
	@docker-compose -f docker/docker-compose.yml build

test: ## Run tests
	@npm run test

clean: ## Clean up Docker containers and volumes
	@docker-compose -f docker/docker-compose.yml down -v
	@docker system prune -f

install: ## Install all dependencies
	@npm run install:all

lint: ## Run linting
	@npm run lint

logs: ## View application logs
	@docker-compose -f docker/docker-compose.yml logs -f

status: ## Check service status
	@docker-compose -f docker/docker-compose.yml ps

restart: ## Restart services
	@docker-compose -f docker/docker-compose.yml restart

stop: ## Stop all services
	@docker-compose -f docker/docker-compose.yml down

quick-start: ## Quick start for new users
	@./scripts/quick-start.sh