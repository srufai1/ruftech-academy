# Lesson — The terminal and the filesystem

## 1. Why the terminal

**In simple words**

Picture a clerk at the school office. You ask which room you are in. The clerk answers, then waits for your next question.

**The technical way**

A terminal lets you tell the computer exactly what to do, in words. Every tool in this
course (Git, Node.js, the checker, Supabase) is driven from it. A server has no desktop, so
this is also how real systems are run.

You type a **command**, press Enter, and read the **output**.

`pwd` means "print working directory". It prints the folder you are in.

**See it**

```bash
pwd
```

**Learn more (free)**

[What pwd prints](https://man7.org/linux/man-pages/man1/pwd.1.html#DESCRIPTION) (read · 74 words · about 1 min)

## 2. The filesystem is a tree

**In simple words**

A cupboard has named drawers. Each drawer can hold smaller boxes. To find a card, tell someone which cupboard, drawer and box to open.

**The technical way**

Everything is a file or a directory (a folder). The top is `/`, called the root.

```text
/
├── home/
│   └── sani/            your home directory, also written ~
│       └── projects/
└── etc/                 system settings
```

A [path](/glossary#path) says where something is.

| Kind | Starts with | Example | Meaning |
| :--- | :--- | :--- | :--- |
| [Absolute](/glossary#absolute-path) | `/` | `/home/sani/projects` | From the root; the same from anywhere |
| [Relative](/glossary#relative-path) | a name, `.` or `..` | `projects/school-system` | From where you are now |

`.` is the current directory. `..` is the one above it. `~` is your home.

**See it**

```bash
cd ~
pwd
```

**Learn more (free)**

[How Linux finds a path](https://man7.org/linux/man-pages/man7/path_resolution.7.html#DESCRIPTION) (read · 1373 words · about 7 min)

## 3. Moving and looking

**In simple words**

Imagine arriving at a new library. First read the sign on the door. Then look along a shelf before opening a book.

**The technical way**

| Command | Does |
| :--- | :--- |
| `pwd` | Shows where you are |
| `ls` | Lists what is here; `ls -l` adds details; `ls -a` shows hidden names (they start with `.`) |
| `cd projects` | Goes into `projects`; `cd ..` goes up; `cd` alone goes home |
| `cat notes.txt` | Prints a file |
| `less notes.txt` | Reads a long file one screen at a time; `q` leaves |

**See it**

```bash
ls -a .
```

**Learn more (free)**

[Listing a directory](https://man7.org/linux/man-pages/man1/ls.1.html#DESCRIPTION) (read · 882 words · about 5 min)

## 4. Making, copying, moving, removing

**In simple words**

Think of a paper report. A photocopy leaves the original in place. Moving the original to another tray leaves the old tray empty.

**The technical way**

| Command | Does |
| :--- | :--- |
| `mkdir reports` | Makes a directory; `mkdir -p a/b/c` makes the whole chain |
| `touch notes.txt` | Makes an empty file |
| `cp a.txt b.txt` | Copies; `cp -r dir1 dir2` copies a directory |
| `mv old.txt new.txt` | Renames or moves |
| `rm notes.txt` | Removes a file. **There is no recycle bin.** |
| `rmdir reports` | Removes an empty directory |

A name with a space must be quoted: `cat "term 1.txt"`. Without quotes the shell sees two
names.

**See it**

```bash
mkdir -p ~/academy-labs/copy-practice
cd ~/academy-labs/copy-practice
touch draft.txt
cp draft.txt spare.txt
ls
```

**Learn more (free)**

[Copying files and folders](https://man7.org/linux/man-pages/man1/cp.1.html#DESCRIPTION) (read · 692 words · about 4 min)

## 5. Permissions

**In simple words**

Picture a locked display case. Everyone in the hall can see the labels. Only the person with the right key can open the case and change its contents.

**The technical way**

A [permission](/glossary#permission) controls access. Use `ls -l` to see who may do what.

```text
-rw-r----- 1 sani staff 120 Nov 12 09:00 fees.csv
drwxr-xr-x 2 sani staff 4096 Nov 12 09:00 reports
```

The first character is the type: `-` file, `d` directory, `l` link. Then three groups of
three letters: for the **owner**, the **group**, and **others**.

| Letter | On a file | On a directory |
| :--- | :--- | :--- |
| `r` | read the content | list the names inside |
| `w` | change the content | add, rename or remove names inside |
| `x` | run it as a program | **enter it** and reach what is inside |

So `x` means two different things. A directory without `x` cannot be entered, even if you can
read its list of names.

Permissions are also written as numbers: `r` = 4, `w` = 2, `x` = 1, added per group.
`rw-r-----` is 6, 4, 0 → `640`.

```bash
chmod 640 fees.csv        # owner reads and writes, group reads, others nothing
chmod u+x backup.sh       # add "run" for the owner (u = user, g = group, o = others)
```

Give the least that works. `chmod 777` ("everyone may do everything") is almost never right.

**See it**

```bash
stat -c "%a %n" ~/.bashrc
```

**Learn more (free)**

[Reading and setting access modes](https://man7.org/linux/man-pages/man1/chmod.1.html#DESCRIPTION) (read · 482 words · about 3 min)

## 6. Links

**In simple words**

A sign outside the office says “Reports in room 2”. Move the reports to room 4 and the sign still points to room 2. Reading the sign and finding the reports are two different jobs.

**The technical way**

A [symbolic link](/glossary#symbolic-link) is a small file that points to another path, like a shortcut.

```bash
ln -s reports/2026 current     # "current" now points to reports/2026
ls -l current                  # current -> reports/2026
```

If the target is moved or removed, the link stays but points nowhere. This is a **broken
link**. `ls -l` still shows it; `cat` says "No such file or directory".

**See it**

```bash
ls -l /bin/sh
```

**Learn more (free)**

[What a symbolic link contains](https://man7.org/linux/man-pages/man7/symlink.7.html#DESCRIPTION) (read · 2379 words · about 12 min)

## 7. Editing in the terminal

**In simple words**

Imagine writing on a slate before copying your note into a book. You can still rub out the words on the slate. Save your work when you want the book to keep it.

**The technical way**

`nano` is the simplest editor. `nano settings.conf` opens the file. The bottom lines show the
keys: `Ctrl+O` then Enter saves, `Ctrl+X` leaves. You may use another editor (vim, or
`code file` to open VS Code). The skill is "change a file where you are", not one editor's
keys.

**See it**

```bash
nano ~/practice-note.txt
```

Type a line, press Ctrl+O and Enter, then Ctrl+X. Open the file again to read the saved line.

**Learn more (free)**

[GNU nano keyboard shortcuts](https://www.nano-editor.org/dist/latest/cheatsheet.html) (read · 411 words · about 3 min)

## 8. Getting help

**In simple words**

A board game comes with a rule sheet. Look up a move when you need it. You can play without learning every rule by heart.

**The technical way**

`ls --help` prints the options. `man ls` opens the manual (`q` leaves). Reading these is
normal work, not a sign that you do not know enough.

**See it**

```bash
man ls
```

Type `/hidden` and press Enter to find the option for hidden files. Press `q` to return.

**Learn more (free)**

[Opening a manual page](https://man7.org/linux/man-pages/man1/man.1.html#EXAMPLES) (read · 281 words · about 2 min)
