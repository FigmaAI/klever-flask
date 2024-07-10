# Figma Plugin with Flask Backend

This plugin demonstrates how to use a Flask-based backend with Figma.

## Quick Start

### 1. Client-side Setup

The client-side is implemented via a Figma plugin.

1. Run `yarn` to install the project's dependencies.
2. In Figma, select `Plugins` -> `Development` -> `Import plugin from manifest...` and choose the `manifest.json` file in this repository.

To modify the plugin's UI, edit the [App.tsx](./src/app/components/App.tsx) file, and to interact with the Figma API, edit the [controller.ts](./src/plugin/controller.ts) file. For more information, refer to the [Figma API Overview](https://www.figma.com/plugin-docs/api/api-overview/).

### 2. Backend Setup

First, install the required packages. This project works with Python 3.6 or higher, and it's recommended to run it in a virtual environment.


```bash
pip install -r requirements.txt
```

### 3. Write and Run the Flask Server

Before running the backend server, you need to navigate to the `src/server`directory.
```bash
cd src/server
```

Then, write and run the Flask web server in the `app.py` file. This repository provides an example `app.py` file, which includes code to set up the Flask application and define several endpoints.

To run the server, use the following command:


```bash
python app.py
```

## How It Works

The Figma plugin and Flask server exchange information as follows:



![uml](./uml.png)
```
sequenceDiagram
    participant Plugin as Figma Plugin
    participant Server as Flask Server
    participant Figma as Figma Plugin API
    participant GPT as OpenAI

    Note over Plugin,Server: /api/get
    Plugin ->> Server: GET request
    activate Server
    Server -->> Plugin: Return static message
    deactivate Server

    Note over Plugin,Server: /api/post
    Plugin ->> Figma: Request design system info
    activate Figma
    Figma -->> Plugin: Return design system info
    deactivate Figma
    Plugin ->> Server: POST design system info
    activate Server
    Server ->> Server: save/update data
    Server -->> Plugin: Return response message
    deactivate Server



    Note over Plugin,Server: /api/rico
    Plugin ->> Server: Request for RICO dataset
    activate Server
    Server -->> Server: Check if RICO dataset exists
    alt RICO dataset does not exist
        Server -->> Plugin: Return error and download link
    else RICO dataset exists
        Server ->> Server: Select and save JSON files from dataset
        Server -->> Plugin: Return success message
    end
    deactivate Server

    Note over Plugin,Server: /api/generateMappingTable
    Plugin ->> Server: Request for mapping table
    activate Server
    Server ->> Server: Load saved JSON files
    loop for each JSON files
        Server ->> GPT: Send componentLabel, ancestors, and design system info
        activate GPT
        GPT -->> Server: Return similar design system name and key
        deactivate GPT
        Server ->> Server: Update JSON file
    end
    Server -->> Plugin: Return response message
    deactivate Server
```