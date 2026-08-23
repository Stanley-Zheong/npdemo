.PHONY: test build qa-assets dev-api dev-web clean

NPM_CONFIG_CACHE ?= $(CURDIR)/.cache/npm

test:
	cd backend && mvn test
	cd frontend && npm_config_cache="$(NPM_CONFIG_CACHE)" npm ci && npm run check
	node --test test/asset-query.test.mjs

build:
	cd backend && mvn package
	cd frontend && npm_config_cache="$(NPM_CONFIG_CACHE)" npm ci && npm run build

qa-assets:
	node sbin/skill-asset-query.mjs --skill test-case-review --query "health IAM CRS EXM" --max-bytes 20000

dev-api:
	cd backend && mvn spring-boot:run

dev-web:
	cd frontend && npm run dev

clean:
	cd backend && mvn clean
	rm -rf frontend/dist frontend/coverage
