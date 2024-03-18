SHELL                 = /bin/bash

APP_NAME              = smocker
VERSION               = $(shell git describe --always --tags $(shell git rev-list --tags --skip=${SKIP_VERSION} --max-count=1))
GIT_COMMIT            = $(shell git rev-parse HEAD)
GIT_DIRTY             = $(shell test -n "`git status --porcelain`" && echo "+CHANGES" || true)
BUILD_DATE            = $(shell date '+%Y-%m-%d-%H:%M:%S')
SQUAD                 = frontend
BUSINESS              = platform

.PHONY: default
default: help

.PHONY: help
help:
	@echo 'Management commands for ${APP_NAME}:'
	@echo
	@echo 'Usage:'
	@echo '    make install                            Install dependencies.'
	@echo '    make build                              Build application.'
	@echo '    make package                            Build, tag, and push Docker image.'
	@echo '    make deploy                             Deploy to Kubernetes via Helmfile.'
	@echo

.PHONY: install
install:
	@echo "Installing dependencies for ${APP_NAME} ${VERSION}"
	CI=true pnpm install --frozen-lockfile

.PHONY: build
build:
	@echo "Building ${APP_NAME} ${VERSION}"
	CI=true \
	CI_ENV=${ENV} \
	NODE_ENV=production \
	VERSION=${VERSION} \
	pnpm build

.PHONY: package
package:
	@echo "Build, tag, and push Docker image ${APP_NAME} ${VERSION} ${GIT_COMMIT}"
	docker buildx build \
		--build-arg VERSION=${VERSION} \
		--build-arg GIT_COMMIT=${GIT_COMMIT}${GIT_DIRTY} \
		--cache-from type=local,src=/tmp/.buildx-cache \
		--cache-to type=local,dest=/tmp/.buildx-cache \
		--tag ${DOCKER_REPOSITORY}/${APP_NAME}:${GIT_COMMIT} \
		--tag ${DOCKER_REPOSITORY}/${APP_NAME}:${VERSION} \
		--tag ${DOCKER_REPOSITORY}/${APP_NAME}:${VERSION}-${ENV_NAME} \
		--tag ${DOCKER_REPOSITORY}/${APP_NAME}:latest \
		--push .

.PHONY: deploy
deploy:
	@echo "Deploying ${APP_NAME} ${VERSION}"
	export APP_NAME=${APP_NAME} && \
	export VERSION=${VERSION} && \
	export SQUAD=${SQUAD} && \
	export BUSINESS=${BUSINESS} && \
	helmfile apply

.PHONY: get-app-name
get-app-name:
	@echo ${APP_NAME}

.PHONY: get-business-unit
get-business-unit:
	@echo ${BUSINESS}
