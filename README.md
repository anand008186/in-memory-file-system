# In-Memory File System

## Introduction

This project implements an in-memory file system in Node.js. The file system supports basic operations such as creating directories, navigating the file system, creating, reading, moving, copying, and deleting files, and listing directory contents.

## Structure

The project is structured as follows:

- `src/`: Contains the source code for the file system.
  - `File.js`: Defines the `File` class.
  - `Directory.js`: Defines the `Directory` class.
  - `FileSystem.js`: Implements the `FileSystem` class, which manages the entire file system.
  - `cli.js`: Provides a command-line interface for interacting with the file system.
- `tests/`: Contains the unit tests for the file system.
  - `fileSystem.test.js`: Tests the `FileSystem` class.
- `docs/`: Contains the project documentation.
  - `README.md`: This document.
- `package.json`: Defines the project dependencies and scripts.
- `jest.config.js`: Configures Jest for testing.


## Setup

### Prerequisites

- Node.js (>= 14.x)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/in-memory-file-system.git
   cd in-memory-file-system
