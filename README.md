# KaviosPix - Image Sharing
An API-based image management system similar to Google Photos with authentication through Google Auth. Users can create albums, share them with others via email, and upload images with various metadata. The project will allow adding tags, comments, favorites, and person names to the images. Only image files are allowed, and thereʼs a set maximum file size per upload.

Built with React frontend, Express/Node backend, Cloudinary, Google OAuth authentication and MongoDB database.

---

## Demo Link
[Live Demo](https://kavios-pix-delta.vercel.app)

---

## Quick Start
```
git clone https://github.com/Sowhom638/KaviosPix
cd <Your-Repo>
npm install
npm run dev
```
---

## Technologies
- React JS
- React Router Dom
- Tailwind CSS
- Cloudinary
- JWT
- Google OAuth
- Node JS
- Express JS
- MongoDB

---

## Features
**Authentication**
- User can Sign in/Sign up using gmail account
- A JWT is issued upon successful authentication.

**Album**
- **Shared Users:** List of users (via email) who have access to the album.
- **CRUD:** Users can create albums, update descriptions, delete albums, and share with others via email.

**Image**
- **CRUD:** Users can upload images, tag them, add comments, star them, and delete images.

---

## API References
### Users
**GET /auth/google**
Create a new user
Sample Response
```
{ _id, email, name, authentication, userId, createdAt }
```
**GET /users**
Get all users
Sample Response
```
[
{ _id, email, name, authentication, userId, createdAt },
{ _id, email, name, authentication, userId, createdAt }, ...
]
```

### Albums
**POST /albums**
Create a new album
Sample Response
```
{ _id, name, description, ownerId, sharedUsers, albumId, createdAt }
```
**GET /albums**
Get all albums
Sample Response
```
[
{ _id, name, description, ownerId, sharedUsers, albumId, createdAt },
{ _id, name, description, ownerId, sharedUsers, albumId, createdAt }, ...
]
```
**GET /albums/:id**
Get album by id
Sample Response
```
{ _id, name, description, ownerId, sharedUsers, albumId, createdAt }
```

**POST /albums/:id**
Update album details by id
Sample Response
```
{ _id, name, description, ownerId, sharedUsers, albumId, createdAt }
```
**DELETE /albums/:id**
Delete album by id

### Images
**POST /images**
Upload a new image
Sample Response
```
{ _id, imageUrl, albumId, name, tags, person, isFavorite, size, imageId, comments, uploadedAt }
```
**GET /images**
Get all images
Sample Response
```
[
{ _id, imageUrl, albumId, name, tags, person, isFavorite, size, imageId, comments, uploadedAt },
{ _id, imageUrl, albumId, name, tags, person, isFavorite, size, imageId, comments, uploadedAt }, ...
]
```
**GET /images/:id**
Get image by id
Sample Response
```
{ _id, imageUrl, albumId, name, tags, person, isFavorite, size, imageId, comments, uploadedAt }
```

**POST /images/:id**
Update image details by id
Sample Response
```
{ _id, imageUrl, albumId, name, tags, person, isFavorite, size, imageId, comments, uploadedAt }
```
**DELETE /images/:id**
Delete image by id

---

## Contact
for bugs informing or feature requesting , reach out to ghoshsowhom638@gmail.com