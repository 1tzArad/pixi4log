# [1.3.0](https://github.com/1tzArad/pixi4log/compare/v1.2.0...v1.3.0) (2025-09-10)


### Bug Fixes

* rename AuthorManager to UserManager for consistency ([d7ff857](https://github.com/1tzArad/pixi4log/commit/d7ff857c866c08ab79d80f1097d8ee8cba2c9588))
* set debug logs on DEBUG env variable ([39be9f8](https://github.com/1tzArad/pixi4log/commit/39be9f83097975e9727f140bd1e2453ffd1d80d1))


### Features

* add an enum to manage jwt tokens expire time ([7c57772](https://github.com/1tzArad/pixi4log/commit/7c57772140a6048afb8babf097d567d807a391db))
* add an user jwt payload for generate and verify user token ([d0b02b1](https://github.com/1tzArad/pixi4log/commit/d0b02b16806f97aad0515b15cdc2a0af41e686d4))
* add authMiddleware for handling authorization and token verification ([e1ea064](https://github.com/1tzArad/pixi4log/commit/e1ea06457616bf192f6658b0b3a25e270b78c7bc))
* add authMiddleware to posts and tags routes for enhanced security ([3283492](https://github.com/1tzArad/pixi4log/commit/328349215ab0f40ef40d3309bf8b220d193a558c))
* add authors management basecode ([f3ada5b](https://github.com/1tzArad/pixi4log/commit/f3ada5be3f7ff48840e00a9e04f7ae7d26124aa4))
* add dev debug mode, some other things, add jsonwebtoken and cors dependency ([b8c41eb](https://github.com/1tzArad/pixi4log/commit/b8c41ebadc5f1aeeafc0bc20d4f250190093c7a7))
* add frontend into project ([4bb7cda](https://github.com/1tzArad/pixi4log/commit/4bb7cda0f2b0b39bc605514ab4b6bb616ee29aec))
* add JWT_SECRET variable ([f4cbc2a](https://github.com/1tzArad/pixi4log/commit/f4cbc2a559e090f7dd168dd4ea882c6afad2e147))
* add validation error ([d7971c0](https://github.com/1tzArad/pixi4log/commit/d7971c08d9a0443277a47bb0b0c7be334998323a))
* add workspaces configuration to package.json for better project structure ([1d53cdb](https://github.com/1tzArad/pixi4log/commit/1d53cdb53af58d715bcceed6f7722124ecd98abd))
* create a jwtutils for gen and verify tokens ([bde4f2b](https://github.com/1tzArad/pixi4log/commit/bde4f2b259a3ce45d81f32be426b44b389a3281a))
* created a HashUtils ([9783cf6](https://github.com/1tzArad/pixi4log/commit/9783cf6bb993fee5b23d4f544c75709f41fc335f))
* created a UserValidator ([025498d](https://github.com/1tzArad/pixi4log/commit/025498d1b023e4051b7166ea99eb1992df63b1e9))
* enhance user management with improved create, update, delete, and retrieval methods ([329fa23](https://github.com/1tzArad/pixi4log/commit/329fa23512964325f6e2d732cecd47efee38d51f))
* implement CORS support and update configuration for allowed origins ([f40b648](https://github.com/1tzArad/pixi4log/commit/f40b648b23a4bcab2a81db7a3691043130db9d40))
* implement UsersController with CRUD operations for user management ([4875edd](https://github.com/1tzArad/pixi4log/commit/4875edd3e47265efb61bca514a99a954360f701c))
* update README to include user management and authentication details ([3f2ad46](https://github.com/1tzArad/pixi4log/commit/3f2ad4678ad127426417dcf6e9208cef6fe641a8))

# [1.2.0](https://github.com/1tzArad/pixi4log/compare/v1.1.2...v1.2.0) (2025-07-20)


### Features

* add GitHub Actions workflow for continuous deployment to Liara ([8451cf2](https://github.com/1tzArad/pixi4log/commit/8451cf25e99bbae56b6aefd82191283fadc5da38))

## [1.1.2](https://github.com/1tzArad/pixi4log/compare/v1.1.1...v1.1.2) (2025-07-20)


### Bug Fixes

* update README.md to reflect tag management terminology and API endpoints ([8f2823c](https://github.com/1tzArad/pixi4log/commit/8f2823ce2d6cfeb3d5e66db54cd1ea5e18744698))

## [1.1.1](https://github.com/1tzArad/pixi4log/compare/v1.1.0...v1.1.1) (2025-07-20)


### Bug Fixes

* remove unused imports from postsManager.ts ([eea2db1](https://github.com/1tzArad/pixi4log/commit/eea2db15c29cc9d12fbf6cc4e23afb37265dcf7d))

# [1.1.0](https://github.com/1tzArad/pixi4log/compare/v1.0.0...v1.1.0) (2025-07-20)


### Features

* add README.md with project overview, features, installation, and API documentation ([0a4431f](https://github.com/1tzArad/pixi4log/commit/0a4431f1ed71e0bba8a45a290bcb8632c9ac6ab5))

# 1.0.0 (2025-07-20)


### Bug Fixes

* Implement code changes to enhance functionality and improve performance ([2a5d210](https://github.com/1tzArad/pixi4log/commit/2a5d2107c04f8540a84ee165ce04ef88056995d3))
* remove package-lock.json from .gitignore ([aacc21e](https://github.com/1tzArad/pixi4log/commit/aacc21e3521614df78bc8cb9b1e5a886d2199947))
* update release workflow to include permissions and correct step naming ([7f77d2f](https://github.com/1tzArad/pixi4log/commit/7f77d2fc2167c03572c72fb001e19cae1b17c9fc))


### Features

* add GitHub Actions workflow for automated release process ([d15adf6](https://github.com/1tzArad/pixi4log/commit/d15adf608102afcfcc6f433fcb1dce076360a9ca))
