.PHONY: test build qa-assets qa-health qa-course-draft dev-api dev-web clean

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

qa-health:
	cd test && npm_config_cache="$(NPM_CONFIG_CACHE)" npm ci && npx playwright install chromium && npm run test:health

qa-course-draft:
	cd test && npm_config_cache="$(NPM_CONFIG_CACHE)" npm ci && npx playwright install chromium && ./run-course-draft-local.sh

dev-api:
	cd backend && mvn spring-boot:run

dev-web:
	cd frontend && npm run dev

clean:
	cd backend && mvn clean
	rm -rf frontend/dist frontend/coverage
