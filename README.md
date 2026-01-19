# Leave Maximiser

Turn your annual leave into extended vacations. Leave Maximiser analyzes public holidays to find the perfect dates to book, allowing you to maximize your consecutive days off while minimizing your annual leave usage.

## Features

-   **Maximize Leave**: Algorithmic calculation of the best dates to book off.
-   **Multi-Country Support**: Supports public holidays for multiple countries including Australia, US, UK, Canada, New Zealand, Germany, France, Japan, and Singapore.
-   **Visual Calendar**: Interactive calendar view to visualize leave blocks and public holidays.
-   **Efficiency Score**: See the "Return on Investment" for your leave days (e.g., "Take 4 days, get 10 days off").

## Tech Stack

-   **Framework**: [SolidJS](https://www.solidjs.com/) with [TanStack Start](https://tanstack.com/start)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Routing**: [TanStack Router](https://tanstack.com/router)
-   **State Management**: [TanStack Store](https://tanstack.com/store)
-   **Date Handling**: Native `Date` (UTC) + `date-holidays` library
-   **Icons**: `lucide-solid`
-   **Tooling**: [Biome](https://biomejs.dev/) (Linting & Formatting), [Vite](https://vitejs.dev/)

## Getting Started

1.  **Install dependencies**:

    ```bash
    npm install
    ```

2.  **Run the development server**:

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

-   `npm run dev`: Start the development server.
-   `npm run build`: Build the application for production.
-   `npm run start`: Start the production server.
-   `npm run test`: Run the test suite (Vitest).
-   `npm run check`: Run Biome linting and formatting checks.
-   `npm run format`: Automatically fix formatting issues with Biome.

## Project Structure

-   `src/routes/`: File-based routes (TanStack Router).
-   `src/components/`: Reusable UI components.
-   `src/lib/`: Core logic and maximization algorithms.
-   `AGENTS.md`: Guidelines for AI agents working on this codebase.

## License

MIT
