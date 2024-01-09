# Introduction
Test Cage is a Desktop Application built using the [Tauri-framework](https://tauri.app/v1/guides/getting-started/prerequisites). The frontend (UI) is built using Typescript React, the backend is built using Rust, and SQLite is used for the database. The purpose of this application is to sign out and return Test Fixtures and Test Samples and store a database of all Test Fixtures, Test Samples, and Sign Out Logs.

# Installing/Development
The source code for the Test Cage application is located in [Azure-Dev-ops](https://dev.azure.com/FLC-Embedded/HW-Test/_git/TestCageSignout). To initialize this repository for development follow the steps below.

1. Install `Node.js (LTS)`. Check if Node.js is install on you computer by typing in `node` in either `cmd ` or `powershell`. It should display the Node version installed on the computer. Link to Node install [Node.js](https://nodejs.org/en/download/).
2. Install `Rust`. Check if Rust is install on you computer by typing in `rustc -V` or `rustc --version` in either `cmd ` or `powershell`. It should display the current Rust version installed on the computer. Link to Rust install [Rust](https://www.rust-lang.org/tools/install).
3. Install `DB Browser for Sqlite (Optional)`. DB Browser can be very helpful to view and manually modify the database. Link to DB Browser Install [DB Browser for Sqlite](https://sqlitebrowser.org/dl/).
4. Clone the repository into a folder and open the folder with the text editor/IDE of your choosing.
5. Run `npm install` to install all the dependencies for the frontend react code.
6. Run `cargo install tauri-cli`
7. Run `cargo tauri dev` to run the desktop application in development. This might take a while when first building the project. The application should launch once the build finishes.

## Debugging Tools Frontend (Typescript React)
Open the `DevTools` for the frontend by right clicking the Application and click on inspect. The `DevTools` should open. The console tab should display all the Errors, Warnings and Console Logs if any. To start logging use `console.log("Stuff you want to log");`.

## Debugging Tools Backend (Rust)
You can use Rust's built in unit testing for testing various functions. Link to documentation can be found here [Unit-Testing](https://doc.rust-lang.org/rust-by-example/testing/unit_testing.html). To start logging use `log::info!("Stuff you want to log")`.

## Debugging Tools Database (Sqlite)
Use DB Browser to view and modify the database. Click on the `Execute SQL` tab to execute SQL code for debugging.

# Building for Production
Run the command `cargo tauri build` to build the project for production. This will take a long time to build. After the application has finished building a .msi file and a .exe file should be created. These files can be found in `\testcage\src-tauri\target\release\bundle\msi\` and `\testcage\src-tauri\target\release\bundle\nsis\` folder. Use either .msi or .exe to install the application on any Windows Computer.

# Frontend (Typescript React)
The Frontend (UI) is build using Typescript [React](https://react.dev/reference/react). Some libraries used include [Redux-Tool-Kit](https://redux-toolkit.js.org/usage/usage-guide) for state management and Material UI ([MUI](https://mui.com/material-ui/getting-started/)) for most of the React components. All the frontend code cand be found in `/test-cage/src/`.
## File Structure
```
- src
    - assets // Used to store .css files and other assets to modify the looks of components
    - enums // Folder to store all the enums used throughout the application.
    - features // Folder to store all the feature components such as navigation bars, forms, tables, etc.
    - hooks // Folder to store all the hooks. Hooks are basically functions that handle logic, state, fetch data, etc that can be used over multiple components. 
    - pages // Folder to store all the pages.
    - slices // Folder used to store slices. Slices are a part of Redux tool kit which is a bit complicated to explain so there will be a separate section explaining this.
    - types // Folder to store all the types use through out the frontend
    - utils // Folder to store utility functions use in multiple components
    App.tsx
    main.tsx
    store.ts // Used for Redux tool kit
    vite-env.d.ts 
```
## Redux Tool Kit
Library used for state management. Think of `state` as a collection of all the information that the application needs to function like user settings and data. The information store in this `state` can be accessed in components in the frontend using `useAppSelector()`. For example `const editStatus = useAppSelector((state) => state.appSettings.editMode);` will access the state of `appSettings` and the property `editMode`. A `slice` is a way Redux tool kit used to organize and manage specific parts of the `state`. To modify a state, we create `reducers` (we write reducers in a slice check out the reducers folder for examples) which are pure functions that will determine how states should be modified. To use these reducers to modify the state, we use `const dispatch: AppDispatch = useAppDispatch();` and to execute a reducer we use `dispatch(showSnackBar("Test Fixture Already Exist"));`. In this example we execute the reducer `showSnackBar()` found in `/test-cage/src/slices/snackBarSlice.ts` to set the `message` field to the input message and `open` field to `true`. [Redux-tool-kit-documentation](https://redux-toolkit.js.org/usage/usage-guide).

## Material UI (MUI)
Library containing premade customizable premade components such as Lists and Tables for fast development. Documentation for all [MUI-components ](https://mui.com/material-ui/all-components/).

# Backend (Rust)
The backend is built using Rust. The crates [sqlx](https://github.com/launchbadge/sqlx) is used to communicate with the sqlite database asynchronously.

## File Structure
```
- src-tauri
    - icons // Stores the icons used for the desktop application
    - src
        - database // Folder storing database related files you can make new connectors if a different database is used
            - mod.rs
            - sqlite_connector.rs // Connector that communicates with sqlite
        - types
            - enums.rs // Stores the enums used in various parts of the backend
            - mod.rs
            - struct.rs // Stores the structs used in various parts of the backend
        main.rs
    - target
        - release
            - bundle
                - msi // Stores the .msi file to install the application
                - nsis // Stores the .exe file to install the application
    build.rs
    Cargo.lock
    Cargo.toml // Information on all the dependencies and crates
    output.log // All the logs
    tauri.conf.json // tauri configuration files
    testcage.db // Sqlite database
```

# Features
- Test Samples/Fixtures Table view
- Sign Out Logs Table view
- Adding Test Sample/Fixture 
- Signing out Test Fixture/Samples
- Returning Test Fixture/Samples
- Edit Mode (Updating and Deleting Test Samples/Fixtures) (To access the app settings menu press `alt+enter` can be modified in `/src/features/settings/components/appSettings.tsx`)

# Future Improvements
- Import database feature
  - Import csv data into database
- Export database feature
  - Save database into OneDrive and have one drive sync with share point
- Paging for the tables in lists

# Issues
No know issues so far.