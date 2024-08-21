# Proctoring PoC 
This shows how multiple instances of 100ms SDK can be run in separate iframes

### Steps 
- Clone the repositor
- Install dependencies
    ```bash
    npm install
    ```
- Start internal app
    ```bash
    npm run dev
    ```
- Open the main app which hosts multiple iframes`
    ```bash
    open proctor.html
    ```
- Paste the auth token for subscriber in the token form on top-left. This token will be used to join respective room. 
