# A tcp api to download picture with painter's id at pixiv.

## ⚙ Building
### Dependent installation
```shell
npm install
```
or
```shell
yarn install
```

### Compile the software
```shell
npm run build
```
or
```shell
yarn run build
```

## 🏃 Running
```shell
npm run dev
```
or
```
yarn run dev
```

## 📔 Usage
Apis
| Api | Type | Options | Explain | Example |
| --- | ---- | ---- | ---- | ---- |
| `/get/list` | `GET` | `type` and `uid` | `type`: [one, all],`one`: with `uid`, show a painter's works.`all`: without `uid`, show all painters's works. | `/get/list?type=one&uid=xxx` or `/get/list?type=all` |
| `/get/show` | `GET` | `uid` and `pid` | `uid`: painter's id.`pid`: 'picture's id | `/get/show?uid=xxx&pid=xxx` |
| `/down` | `GET` | `uid` | `uid`: painter's id. | `/down?uid=xxx` |