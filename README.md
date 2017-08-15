# Code Snippet Organizer
> Week 7 -Weekly Project - using express and mongoose, created an application that organizes code snippets that you save for later use

## Downloading Files

> Import
```
mongoimport --db code-snippet --collection users --out users.json
mongoimport --db code-snippet --collection snippets --out snippets.json
```

> Export
```
mongoexport --db code-snippet --collection users --out users.json
mongoexport --db code-snippet --collection snippets --out snippets.json
```
