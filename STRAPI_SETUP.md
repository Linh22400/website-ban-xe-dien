# Strapi Backend Setup Guide

Follow these steps to set up the backend for the Electric Vehicle Website.

## 1. Prerequisites
- Node.js 18+ installed.
- PostgreSQL installed and running (or use a cloud provider like Render/Railway).

## 2. Initialize Strapi Project

Run the following command in the root directory (outside `frontend`):

```bash
npx create-strapi-app@latest backend --quickstart
```
*Note: `--quickstart` uses SQLite. For PostgreSQL, run without `--quickstart` and select "Custom" -> "Postgres".*

## 3. Configure Database (PostgreSQL)

If you chose Custom installation, provide your Postgres credentials:
- **Host**: `127.0.0.1`
- **Port**: `5432`
- **Database**: `banxedien` (create this DB first in pgAdmin/terminal)
- **Username**: `postgres`
- **Password**: `your_password`

## 4. Install Cloudinary Plugin (for Media)

```bash
cd backend
npm install @strapi/provider-upload-cloudinary
```

Create/Edit `config/plugins.ts`:
```typescript
export default ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
});
```
Add Cloudinary keys to `.env`.

## 5. Create Content Types (Schema)

Access Admin Panel at `http://localhost:1337/admin`.

### A. Car Model (`api::car-model.car-model`)
- **Name**: Text (Short)
- **Slug**: UID (target field: Name)
- **Brand**: Text (Short)
- **Description**: Rich Text
- **Thumbnail**: Media (Single Image)
- **HeroImage**: Media (Single Image)

### B. Car Version (`api::car-version.car-version`)
- **Name**: Text (Short)
- **Price**: Number (Decimal)
- **Range**: Number (Integer)
- **TopSpeed**: Number (Integer)
- **Acceleration**: Number (Float)
- **Model**: Relation (CarVersion belongs to CarModel)

### C. Car Color (`api::car-color.car-color`)
- **Name**: Text (Short)
- **HexCode**: String (e.g., #FF0000)
- **Versions**: Relation (CarColor belongs to many CarVersions)

## 6. Add Data
1. Create a few Colors.
2. Create a Car Model (e.g., "VF 8").
3. Create Car Versions linked to that Model.

## 7. API Permissions
1. Go to **Settings** > **Users & Permissions Plugin** > **Roles**.
2. Click **Public**.
3. Check **find** and **findOne** for `Car-model`, `Car-version`, etc.
4. Save.

## 8. Connect Frontend
Update `frontend/lib/api.ts` to fetch from `http://localhost:1337/api/...` instead of mock data.
