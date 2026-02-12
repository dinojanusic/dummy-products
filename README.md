# Dummy Products – Angular Application

Small Angular application that consumes the public **DummyJSON** REST API and allows users to:

- browse products
- view product details
- create new products
- update existing products

## Setup Instructions

### 1. Install dependencies
```bash
npm install
```
### Run dev server
```bash
ng serve
```

### Open application at

http://localhost:4200

## API
### Data is fetched from:
```bash
https://dummyjson.com/products
```
### Used endpoints:
```bash
GET /products
GET /products/{id}
POST /products/add
PUT /products/{id}
```
## Application Structure

- **core/models**: Contains TypeScript interfaces for type safety.
- **core/services**: Handles API communication and session management.
- **features/products**: Contains feature-specific components and logic for products.
  - **product-list**: Displays a list of products.
  - **product-detail**: Shows details of a single product.
  - **product-form**: Form to create or edit a product.
- **shared/components**: Reusable UI components.
  - **error**: Error display component.
  - **loading**: Loading placeholder component.
- **app.ts**: Main application bootstrap file.
- **app.routes.ts**: Application routing configuration.

  ## Key Architectural Decisions

  All data access goes through ProductsService.

  Components remain simple:
  - request data
  - render results
  - trigger actions

  They do not own shared state.

  This separation makes the system easier to reason about and maintain.

  ### Session-based Persistence

  DummyJSON simulates create/update operations but does not persist them.

  To provide a realistic UX, the service stores newly created or updated products in a local in-memory collection.

  When lists are fetched:

  - API results are returned

  - locally modified items override API versions

  - duplicates are removed

  - Refreshing the browser resets this state.

  This approach keeps the solution simple while still behaving like a real application.

  ### Standalone Components

  Standalone components reduce boilerplate and make dependencies explicit at the component level.

  ### Reactive Forms

  Used for create/update flows to ensure:

  - predictable state
  - clear validation rules
  - easier maintenance

  ### Strong Typing

  Interfaces describe the API structure.
  any is avoided to ensure safety and clarity.

  ### Loading & Error Handling

  Basic states are implemented to inform the user while requests are in progress or when they fail.

  ## Trade-offs & Assumptions

  - No persistent backend.
  - No advanced caching or synchronization.
  - Pagination uses simple offset logic.
  - Styling is intentionally minimal.
  - No global state libraries to keep implementation lightweight.
  - Focus placed on clarity and maintainability rather than features.

  ## What I Would Improve With More Time

  - improved UI/UX and responsive design
  - toast/snackbar notifications
  - unit and integration tests
  - accessibility improvements
  - environment-based configuration
  - abstraction layer for API access
  - optimistic updates with rollback strategies
