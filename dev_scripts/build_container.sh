PROJECT_PATH="${PROJECT_PATH:-$(pwd)}"
DEFAULT_NAME="discord-bot-js"
IMAGE_NAME="${IMAGE_NAME:-$DEFAULT_NAME}"
CONTAINER_NAME="${IMAGE_NAME:-$DEFAULT_NAME}"
APP_PORT="${APP_PORT:-9000}"

docker build \
    -t $IMAGE_NAME \
    --no-cache \
    --progress=plain \
    "$PROJECT_PATH"

docker rm --force $CONTAINER_NAME

docker run \
    --restart always \
    -t -d \
    -p "$APP_PORT:9000" \
    --env-file "$PROJECT_PATH/.env.dev" \
    --name $CONTAINER_NAME \
    -v "$HOME./.aws:/root/.aws" \
    $IMAGE_NAME