# About
This project is part of the **Harck CMS by [Harckade](https://www.harckade.com) - A free and opensource serverless content management system**

This repository represents the frontend part of the backoffice, powered by [React](https://github.com/facebook/create-react-app), and it is meant to be deployed alongside with the Harck CMS API (backend).

> [!WARNING]
> Harckade and Harck CMS team is not associated with any entity that is not listed on [Harckade](https://www.harckade.com) official website nor responsible for any damage/content that those entities may produce.
> Harckade is also not responsible for any abuse of local or global laws or policies that may result from malicious actors that use Harckade's technology.

# Logos
All Harckade and Harck CMS logos and images are object of copyright and its usage is **NOT** allowed for the purpose outside of this project. Meaning, that you are not authorized to modify or use any of the logos/images on your own projects and claim them as your property/creation.

We also do not authorize to use Harckade and Harck CMS logos and images without attaching the license of this project, unless you have a formal authorization from the Harckade/Harck CMS author. 

The only exceptions to the display usage of the images, without any modification (except background removal) are:
- Academic research and other educational purposes
- Presentations, videos and other multimedia content where Harckade/Harck CMS is mentioned
- Projects clearly mentioning the original Harck CMS repository or [Harckade](https://www.harckade.com) website.


# Global requirements
0. Microsoft Azure account
1. Setup a Microsoft Entra ID (formerly known as Azure Active Directory) tenant. You can follow this [guide](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-create-new-tenant)
2. Create an `App registration` as a Single-page app. You can follow this [guide](https://learn.microsoft.com/en-us/entra/external-id/customers/how-to-register-ciam-app?tabs=spa)
3. On the created App registration, create `App roles` following this [guide](https://learn.microsoft.com/en-us/entra/identity-platform/howto-add-app-roles-in-apps), with respective keys and values:
    ```javascript
    "Display name" = "Administrator"
    "Value" = "administrator"
    "Description" = "CMS portal administrator"
    ```
    ```javascript
    "Display name" = "Editor"
    "Value" = "editor"
    "Description" = "CMS portal editor. Can do everything an admin can except add/delete users"
    ```
    ```javascript
    "Display name" = "Viewer"
    "Value" = "viewer"
    "Description" = "CMS portal viewer. Cannot edit - View only"
    ```
4. On the left panel, under the `Manage` section go to the `Authentication` tab and add a Single-page application platform.
    - If this is your development instance you may want to add `http://localhost:3000` as your redirect URI
    - For production website use your static web app URI
    - Under the `Implicit grant and hybrid flows` section make sure that only `Access tokens (used for implicit flows)` is checked.
    - On the `Advanced settings` make sure that you do not allow the usage of `public client flows` by selecting the option `No`. `No` should be highlighted.
5. On the left panel, under the `Manage` section go to the `Certificates & secrets` tab and generate a set of credentials with a desired expiration (You will need them later on the next sections of this guide). You can name it anything you want, for example: "harckade_credentials"
6. On the left panel, under the `Manage` section go to the `Token configuration` tab and add an `optional claim` of `access` type - email (The addressable email for this user, if the user has one)
7. On the left panel, under the `Manage` section go to the `Expose an API` tab and add a new scope:
    - Scope name: api
    - who can consent?: Admins and users
    - Admin consent display name: Harck CMS
    - Admin consent description: Authorize the usage of Microsoft Entra ID on Harck CMS
    - State: Enabled
8. On the left panel, under the `Manage` section go to the `API permissions` tab and add the following permissions, by clicking on the `Add a permission` button:
- select `My API` tab
    - api (Harck CMS)
    - add permission
- Microsoft Graph
    - Delegated permissions:
        1. email
        2. offline_access
        3. openid
        4. profile
        5. User.Read
    - Application permissions:
        1. Application.Read.All
        2. AppRoleAssignment.ReadWrite.All
        3. User.Invite.All
        4. User.Read.All
        5. User.ReadWrite.All
    - Then, click on the `Grant admin consent for "YOUR_APP_REGISTRATION_NAME"`
9. Navigate back to the main Azure portal page and open `Microsoft Entra ID`. Then, on the left panel click on the `Enterprise applications`.
    - You should have, at least, one application for Harck CMS with the same name as your app registration
    - Open it and navigate to the `Users and groups` tab
    - Click on the `Add user/group` button, select your user and then the `administrator` role and hit the `Assign` button
10. From your App registration save the `Directory (tenant) ID` and the `Application (client) ID`


## Requirements to run this project locally
First, make sure that you completed all the steps described under the "Global requirements" section. Then, fill the `.env` file with respective keys and values.


> [!NOTE]
> If you have an instance of the API running on the Azure you may use the `REACT_APP_BACKEND_API_HOST` as your single API endpoint. However, if you want to run your Azure functions locally, fill the `REACT_APP_BACKEND_PRIVATE_API_HOST`, `REACT_APP_BACKEND_FILES_API_HOST`, `REACT_APP_BACKEND_ADMIN_API_HOST`, `REACT_APP_BACKEND_SIGNALR_API_HOST` and `REACT_APP_BACKEND_NEWSLETTER_API_HOST` accordingly.

```javascript
REACT_APP_ENVIRONMENT = 'dev'
REACT_APP_BACKEND_API_HOST = 'https://harck-{your-project-name}-api.azure-api.net'
#REACT_APP_BACKEND_PRIVATE_API_HOST = 'http://localhost:7071'
#REACT_APP_BACKEND_FILES_API_HOST = 'http://localhost:7072'
#REACT_APP_BACKEND_ADMIN_API_HOST = 'http://localhost:7073'
#REACT_APP_BACKEND_SIGNALR_API_HOST = 'http://localhost:7074'
#REACT_APP_BACKEND_NEWSLETTER_API_HOST = 'http://localhost:7075'

REACT_APP_CLIENT_ID = 'MICROSOFT_ENTRA_ID_Application_(client)_ID'
REACT_APP_TENANT_ID = 'MICROSOFT_ENTRA_ID_Directory_(tenant)_ID'
REACT_APP_REDIRECT_URI = 'http://localhost:3000/'
REACT_APP_API_SCOPE = 'Value from the scope obtained at the step 7. - Global requirements'
REACT_APP_USERNAME = "test-user@YOUR_INSTANCE_NAME.onmicrosoft.com" /* only needed for Cypress integration - do not store any sensitive production data, such as passwords, on your .env file */
REACT_APP_PASSWORD = "user_password" /* only needed for Cypress integration */
REACT_APP_CLIENT_SECRET = "SECRET_GENERATED_ON_STEP_5_GLOBAL_REQUIREMENTS" /* only needed for Cypress integration */
GENERATE_SOURCEMAP=true
CYPRESS_PROJECT_ID = "CYPRESS_ID" /* only needed for Cypress integration */
```

### Cypress
On this project Cypress is used to test the frontend integration with the backend, as well as some of the frontend functionalities.


You may find all Cypress tests under `HARCK-CMS-FE\cypress`. Cypress tests will only be executed if you provide a CYPRESS_PROJECT_ID. 

> [!WARNING]
> You may not want to execute it on your production environment. It executes actions that can add, edit and remove content!


For more information about Cypress go to the official [documentation](https://docs.cypress.io/guides/cloud/introduction).


> [!WARNING]
> Before running any tests make sure you have completed all previous steps

To run the tests locally use: `npm run-script test`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`
> [!NOTE]
> It was present with [Create React App](https://github.com/facebook/create-react-app) kit.
> this is a one-way operation. Once you eject, you can’t go back!

If you aren’t satisfied with the build tool and configuration choices, you can eject at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except eject will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use eject. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

# Deploy online
## Requirements
- Harck CMS backoffice (API) backend: check out Harck CMS backend project's documentation
- Azure Static Web Apps properly configured
- Github Actions `Actions secrets and variables` configured
- Custom domain (optional)

### Azure static Web Apps
Navigate to [Azure portal](https://portal.azure.com) and go to `Static Web Apps` section.
Then, perform the following actions:
1. Click on `create` button
2. Select your subscription and resource group
3. Enter a name for your website and select the `Free: For hobby or personal projects` plan
4. Choose a location that is nearest to you or your target audience
5. Under the `Deployment details` make sure `GitHub` is selected
6. If needed link your Github account with Azure and then select the organization and repository to which you have cloned the Harck CMS Frontend project
7. Select the desired branch (if it's your production website keep the `main` branch)
8. Keep the Build preset empty
9. Click `Review + create` and finish the setup
10. Once the setup is finished, open the static app on the Azure portal and copy the deployment token by clicking on the `Manage deployment token`. You will need it for the GitHub Actions configuration

### GitHub Actions configuration
Open the repository you have cloned and navigate to `Settings` section.

There, on the left side expand the `Secrets and variables` under `Security` section and click on `Actions`.
You need to configure the following secrets (make sure the secrets names are spelled correctly, as they are used by GitHub Actions workflow):
1. AZURE_STATIC_WEB_APPS_API_TOKEN (token to deploy the website on Azure Static Web Apps)
2. API_SCOPE (Copy from the step 7. - "Global requirements")
3. BACKEND_API_HOST (Harck CMS backoffice API URL - check Harck CMS backend repository documentation)
4. CLIENT_ID (Copy from the step 10. - "Global requirements")
5. TENANT_ID (Copy from the step 10. - "Global requirements")
6. CLIENT_SECRET (Copy from the step 5. - "Global requirements")
7. REDIRECT_URI (your static web app URI)
8. USERNAME (Only needed for Cypress)
9. PASSWORD (Only needed for Cypress)
10. CYPRESS_PROJECT_ID (Only needed for Cypress)
11. CYPRESS_RECORD_KEY (Only needed for Cypress)

### Custom domain
Navigate to [Azure portal](https://portal.azure.com) and go to your Harck client's Static Web App.
Then, on the left panel, under `settings` section click on the `Custom domains` and follow this [guide](https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain).


## Robots.txt
By default, your backoffice portal disallow any search engine from indexing it. Please note, that this `robots.txt` is only intended for the Backoffice portal and not the actual blog. 


Feel free to update it at your own risk at `public\robots.txt`.