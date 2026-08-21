.PHONY: test build dev-api dev-web clean

test:
	cd backend && mvn test
	cd frontend && npm ci && npm run check

build:
	cd backend && mvn package
	cd frontend && npm ci && npm run build

dev-api:
	cd backend && mvn spring-boot:run

dev-web:
	cd frontend && npm run dev

clean:
	cd backend && mvn clean
	rm -rf frontend/dist frontend/coverage
