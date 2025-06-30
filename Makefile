.PHONY: help dev prod build test clean install lint

help: ## Show this help message
	@echo "Hardwood Species Selector - Available Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start development environment
	@./start-dev.sh

prod: ## Deploy to production
	@./deploy-prod.sh

build: ## Build the application
	@npm run build

test: ## Run tests
	@npm run test

clean: ## Clean up Docker containers and volumes
	@docker-compose down -v
	@docker system prune -f

install: ## Install all dependencies
	@npm run install:all

lint: ## Run linting
	@npm run lint

logs: ## View application logs
	@docker-compose logs -f

status: ## Check service status
	@docker-compose ps

restart: ## Restart services
	@docker-compose restart

stop: ## Stop all services
	@docker-compose down

quick-start: ## Quick start for new users
	@./quick-start.sh
