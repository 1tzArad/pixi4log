# Pixi4log

A simple blog backend built with Node.js, Express, TypeORM, and PostgreSQL.

## Features

- Tag management (CRUD)
- Post management (CRUD, change Tag)
- User management (CRUD, JWT auth)
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

Copy `.env.example` to `.env` and fill in your configuration:

```
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASS=your_db_password
PORT=3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
JWT_SECRET=your_long_random_secret
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

### Tags

#### Get All Tags

- **GET** `/tags/`

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

#### Get Tag by Identifier

- **GET** `/tags/:identifier`

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

#### Create Tag (protected)

- **POST** `/tags/new`

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

#### Edit Tag (protected)

- **POST** `/tags/edit`

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

#### Delete Tag (protected)

- **POST** `/tags/delete`

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

#### Create Post (protected)

- **POST** `/posts/new`

Protected. Send Authorization header.

**Request Body:**
```json
{
  "content": "string",
  "tagNames": ["string"]
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Post created successfully!"
}
```

#### Edit Post (protected)

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

#### Delete Post (protected)

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

#### Change Post Tag (protected)

- **POST** `/posts/category/change`

**Request Body:**
```json
{
  "postIdentifier": { "uuid": "string" | "timestamp": number | "tag": { "uuid": "string" } },
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

### Users

#### Get All Users

- **GET** `/users/`
- Optional query: `fields` (comma-separated list of fields)

#### Get User by Identifier

- **GET** `/users/:identifier`
- `identifier` can be a UUID, an email address, or a username

#### Create User (sign up)

- **POST** `/users/new`

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

Returns a JWT token on success.

#### Edit User (protected)

- **POST** `/users/edit`

**Request Body:**
```json
{
  "identifier": { "uuid"?: "string", "email"?: "string", "username"?: "string" },
  "newData": { "username"?: "string", "email"?: "string", "password"?: "string" }
}
```

#### Delete User (protected)

- **POST** `/users/delete`

**Request Body:**
```json
{
  "identifier": { "uuid"?: "string", "email"?: "string", "username"?: "string" }
}
```

---

## Authentication

Protected endpoints require a valid JWT in the Authorization header.

- Header: `Authorization: Bearer <token>`
- Tokens are issued by `POST /users/new` upon successful user creation.
- Token verification uses the `JWT_SECRET` from your environment configuration.

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