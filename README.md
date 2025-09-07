# Pixi4log

A simple blog backend built with Node.js, Express, TypeORM, and PostgreSQL.

## Features

- Tag management (CRUD)
- Post management (CRUD, change Tag)
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

- **GET** `/tag/`

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

#### Get tag by Identifier

- **GET** `/tag/:identifier`

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

#### Create tag

- **POST** `/tag/new`

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
  "message": "tag Created Successfully!"
}
```

#### Edit tag

- **POST** `/tag/edit`

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
  "message": "tag has been updated successfully"
}
```

#### Delete tag

- **POST** `/tag/delete`

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
  "message": "tag deleted successfully"
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
      "tag": { ... },
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
    "tag": { ... },
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
  "tagName": "string"
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
  "identifier": { "uuid": "string" | "timestamp": number | "tag": { "uuid": "string" } },
  "newData": { "content"?: "string", "tag"?: { "uuid": "string" } }
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
  "identifier": { "uuid": "string" | "timestamp": number | "tag": { "uuid": "string" } }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Post deleted successfully!"
}
```

#### Change Post tag

- **POST** `/posts/tag/change`

**Request Body:**
```json
{
  "postIdentifier": { "uuid": "string" | "timestamp": number | "tag": { "uuid": "string" } },
  "newtagIdentifier": { "uuid": "string" | "name": "string" }
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

## Collaboration

Contributions are welcome! 🎉  

If you’d like to contribute:

1. Fork the repository  
2. Create a new branch (`git checkout -b feature/your-feature`)  
3. Commit your changes (`git commit -m "Add new feature"`)  
4. Push to the branch (`git push origin feature/your-feature`)  
5. Open a Pull Request  

Please make sure your code follows the existing style and includes relevant tests if possible.

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.