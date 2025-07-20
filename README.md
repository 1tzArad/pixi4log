# Pixi4log

A simple blog backend built with Node.js, Express, TypeORM, and PostgreSQL.

## Features

- Category management (CRUD)
- Post management (CRUD, change category)
- Logging and error handling
- Environment-based configuration

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- PostgreSQL

### Installation

```sh
git clone https://github.com/yourusername/pixi4log.git
cd pixi4log
npm install
```

### Configuration

Copy `.env.example` to `.env` and fill in your database credentials:

```
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASS=your_db_password
PORT=3000
```

### Running the Project

For development:

```sh
npm run dev
```

For production:

```sh
npm run build
npm start
```

---

## API Endpoints

### Categories

#### Get All Categories

- **GET** `/category/`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "uuid": "string",
      "name": "string",
      "fancyName": "string",
      "icon": "string",
      "posts": [ ... ]
    }
  ]
}
```

#### Get Category by Identifier

- **GET** `/category/:identifier`

**Response:**
```json
{
  "status": "success",
  "data": {
    "uuid": "string",
    "name": "string",
    "fancyName": "string",
    "icon": "string",
    "posts": [ ... ]
  }
}
```

#### Create Category

- **POST** `/category/new`

**Request Body:**
```json
{
  "name": "string",
  "fancyName": "string",
  "icon": "string"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Category Created Successfully!"
}
```

#### Edit Category

- **POST** `/category/edit`

**Request Body:**
```json
{
  "identifier": { "uuid": "string" | "name": "string" | "post": { "id": "string" } },
  "newData": { "name"?: "string", "fancyName"?: "string", "icon"?: "string" }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Category has been updated successfully"
}
```

#### Delete Category

- **POST** `/category/delete`

**Request Body:**
```json
{
  "identifier": { "uuid": "string" | "name": "string" | "post": { "id": "string" } }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Category deleted successfully"
}
```

---

### Posts

#### Get All Posts

- **GET** `/posts/`
- Optional query: `fields` (comma-separated list of fields)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "string",
      "content": "string",
      "category": { ... },
      "timestamp": 1234567890
    }
  ]
}
```

#### Get Post by Identifier

- **GET** `/posts/:identifier`
  - `identifier` can be a UUID or a timestamp

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "string",
    "content": "string",
    "category": { ... },
    "timestamp": 1234567890
  }
}
```

#### Create Post

- **POST** `/posts/new`

**Request Body:**
```json
{
  "content": "string",
  "categoryName": "string"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Post created successfully!"
}
```

#### Edit Post

- **POST** `/posts/edit`

**Request Body:**
```json
{
  "identifier": { "uuid": "string" | "timestamp": number | "category": { "uuid": "string" } },
  "newData": { "content"?: "string", "category"?: { "uuid": "string" } }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Post updated successfully!"
}
```

#### Delete Post

- **POST** `/posts/delete`

**Request Body:**
```json
{
  "identifier": { "uuid": "string" | "timestamp": number | "category": { "uuid": "string" } }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Post deleted successfully!"
}
```

#### Change Post Category

- **POST** `/posts/category/change`

**Request Body:**
```json
{
  "postIdentifier": { "uuid": "string" | "timestamp": number | "category": { "uuid": "string" } },
  "newCategoryIdentifier": { "uuid": "string" | "name": "string" }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Post updated successfully!"
}
```

---

## Error Response Example

```json
{
  "status": "error",
  "error": {
    "type": "NotFound" | "ServerError" | "exists",
    "message": "Error message"
  }
}
```

---

## License

MIT