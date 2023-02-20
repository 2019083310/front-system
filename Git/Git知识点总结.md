# Git常见面试题总结

### 1.列举工作中的常见的git命令

- 设置用户名邮箱：git config --global user.name 用户名
  - ​	git config --global user.email 邮箱

- 初始化git仓库：git init

- 查看本地库状态：git status

- 新增文件提交到暂存区：git add .---提交所有新增文件

  - git add 文件名---提交要新增的文件

- 提交到本地库的命令：git commit -m '提交信息'

- 别名相关:查看别名：git remote -v

  - 起别名：git remote add 别名 git仓库地址

- 查看历史版本：git reflog/git log  一个是查看版本信息，一个是查看详细历史版本信息

  ​	版本穿梭：git reset --hard 版本号

- 分支:查看分支：git branch -v

  - 新增分支：git branch 分支名
  - 切换分支：git checkout 分支名
  - 合并分支：git merge 要合并的分支名/git rebase 分支名

- 提交到远程仓库：git push 远程仓库地址

  - git push 别名 分支名
  - git push SSH免密登录

- 从远程仓库拉取到本地库：git pull 远程仓库地址/SSH免密登录

- 克隆：git clone 远程仓库地址

### 2.提交时发生冲突，或者是合并分支时发生冲突，怎么解决冲突问题？

​	在开发过程中，我们都有自己的分支，所以冲突发生的并不多，但也碰到过。

​	冲突产生的表现，提交时后面的状态为MERGING

​	冲突产生更的原因：合并分支时，两个分支在同一个文件的同一个位置有两套完全不同的修改，GIT无法替我们决定使用哪一个，必须人为决定新代码的内容。

​	怎么解决：编辑有冲突的文件，删除特殊符号，决定要使用的内容==>修改完一定要提交到暂存区和本地库，这个时候提交不能带文件名

- 首先通过git stash将工作区的修改提交到栈区，目的是保存工作区的修改。
- 通过git pull命令拉去远程分支上的代码合并到本地分支上，对是消除冲突。
- 通过 git stash pop 命令，把保存在栈区的修改部分合并到最新的工作空间。

### 3.Git和SVN的区别

| GIt                                    | SVN                                  |
| -------------------------------------- | ------------------------------------ |
| 1.分布式版本控制工具                   | 1.集中式版本控制工具                 |
| 2.它属于第三代版本控制工具             | 2.它属于第二代版本控制工具           |
| 3.push/pull操作更快                    | 3.push/pull操作更慢                  |
| 4.离线也可以操作                       | 4.只允许在线提交                     |
| 5.客户端可以在本地库中克隆修改整个仓库 | 5.版本历史记录存储在服务器端存储库中 |

### 4.git pull 和git fetch的区别

​	git pull 和git fetch都是从远程仓库中拉取到本地库中，但是它们两个的过程不一样的。

​	git pull：git pull是从远程仓库的特定分支上提取新的更改和提交，并更新到本地存储库中。

​	git fetch：git fetch是从特定的分支上提取新的更改或提交，但是它会把新的更改和提交放在一个新的分支上，如果想在目标分支上更新，还需要执行git merge指令

​	相当于git pull=git fetch+git merge

### 5.如何查看分支提交的历史记录？查看某个文件的历史记录？

查看分支提交的历史记录:

​	git reflog -number：表示查看当前分支提交的前Number次历史记录

​	git log -number：表示查看当前分支提交的前Number次详细的历史记录

​	注意：如果不写-number默认会显示所有提交的历史记录

​	如果想要查看某个文件的历史记录，只需要在后面加入要查看的文件名

### 6.说一下git系统中的head、工作树和索引之间的区别？

head文件-->包含当前分支的引用(指针).

工作树-->是把当前分支检出到工作空间后形成的工作树，一般开发工作都会基于工作树进行。

索引index文件-->是对工作树进行代码修改后，通过add命令更新索引文件，git系统通过索引index文件生成tree对象.

### 7.git merge和git rebase的区别?

简单的来说，我们知道Git merge 和git rebase都是合并分支的命令。

git merge branch会把branch分支的差异内容pull到本地，然后与本地分支的内容一并形成一个committer对象提交到主分支上，合并到的分支与主分支一致。就是说git merge 会自动创建一个新的commit，而且遇到冲突的时候，仅需要修改后重新commit，但是每次merge都会产生一个commit，很杂乱。

git rebase branch会合并之前的commit历史，但是合并出现问题不容易定位问题出现在哪里。

因此，如果要合并分支特别是合并到主分支的时候，要保留详细的提交信息，建议使用merge,如果发现修改的文件commit的太过频繁，建议使用rebase

### 8.如何知道是否已经合并了分支？

这个答案很简单，如果想知道某个分支是否已经合并到主分支，你可以使用以下命令:

​	git branch -merged //它列出了已合并到当前分支的分支。

​	git branch -no-merged //它列出了未合并到当前分支的分支。

### 9.什么情况下会使用git stash命令？

通常情况下，当我们一直在处理项目的某一个部分时，如果我们想要在某个时候切换到某个分支去处理其他事情，而且我们还不想吧未完成的工作内容提交，这个时候我们就可以用git stash命令，会将我们的工作目录，即修改后的跟踪文件和暂存的更改保存在一堆未完成的更改中，当你重新回到该分支时，可以用git stash pop去除该分支未完成的工作任务继续开发。

在解决冲突的时候也会用到git stash命令。

### 10.如何撤销本次提交错误操作?

如果想撤销提交到暂存区的文件，可以通过git reset HEAD 文件名

如果想撤销提交到本地仓库的文件，可以通过git reset -soft HEAD^n恢复至当前分支的版本与上一次一致。

可以通过git reset -mixed HEAD^n恢复当前分支的版本库和索引区与上一次提交的状态一致。

### 11.说一下gitflow工作流程?

gitflow可以用来管理分支。常用的分支主要包括:

master分支：最为稳定功能比较完整的随时可发布的代码，即代码开发完成，经过测试，没有明显的bug，才能合并到master分支。

develop分支：用作平时开发的主分支，永远是功能最新最全的分支，包含所有要发布到下一个release的代码，主要用于合并其他分支，比如feature分支。

feature分支：用来开发新功能的分支，一旦开发完成，通过测试没有问题再合并到develop分支。

release分支：用于发布准备的专门分支，当开发到一定程度，快要发布时，建立release分支进行代码的测试和修改bug，全部测试没有问题，将release分支合并到master和develop分支。

hotfix分支：用于修复线上代码的bug。从master分支上拉，完成修复后，打上tag合并到master和develop分支。

GitFlow主要工作流程

1.初始化项目为gitflow , 默认创建master分支 , 然后从master拉取第一个develop分支

2.从develop拉取feature分支进行编码开发(多个开发人员拉取多个feature同时进行并行开发 , 互不影响)

3.feature分支完成后 , 合并到develop(不推送 , feature功能完成还未提测 , 推送后会影响其他功能分支的开发)；合并feature到develop , 可以选择删除当前feature , 也可以不删除。但当前feature就不可更改了，必须从release分支继续编码修改

4.从develop拉取release分支进行提测 , 提测过程中在release分支上修改BUG
5.release分支上线后 , 合并release分支到develop/master并推送；合并之后，可选删除当前release分支，若不删除，则当前release不可修改。线上有问题也必须从master拉取hotfix分支进行修改；
6.上线之后若发现线上BUG , 从master拉取hotfix进行BUG修改；
7.hotfix通过测试上线后，合并hotfix分支到develop/master并推送；合并之后，可选删除当前hotfix ，若不删除，则当前hotfix不可修改，若补丁未修复，需要从master拉取新的hotfix继续修改；
8.当进行一个feature时 , 若develop分支有变动 , 如其他开发人员完成功能并上线 , 则需要将完成的功能合并到自己分支上，即合并develop到当前feature分支；
9.当进行一个release分支时 , 若develop分支有变动 , 如其他开发人员完成功能并上线 , 则需要将完成的功能合并到自己分支上，即合并develop到当前release分支 (!!! 因为当前release分支通过测试后会发布到线上 , 如果不合并最新的develop分支 , 就会发生丢代码的情况)；

### 12.git的结构和工作流程

要明白git的工作流程和结构，会使用github ,gittee,gitlab

![img](https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fstatic.oschina.net%2Fuploads%2Fspace%2F2014%2F1118%2F190537_lVOx_820500.png&refer=http%3A%2F%2Fstatic.oschina.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1639194351&t=f380e9e56ff87c8d3a129728462899ea)