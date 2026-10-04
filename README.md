# Pi-edit-git-commit

Pi extension to commit after each edit or write.

## Setup with pi

```bash
pi install git:github.com/AlexanderSambale/pi-edit-git-commit.git
```

## Commands added

```bash
/willCommit
```

Toggles boolean value for commiting after edit/write changes. Default is false and reset to false on restart.

## Settings

In `settings.json` you can set

```json
{
  ...
  "edit-git-commit": {
    "willCommit": <true|false>
  }
}
```

to have willCommit set to this value on every new session.
