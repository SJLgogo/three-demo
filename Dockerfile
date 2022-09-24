# 本次项目基本dockerfile配置项
# 基础镜像
FROM amd64/nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf
# 将打包好的项目文件拷贝到容器对应位置
COPY dist /usr/share/nginx/html/huiztech-construct-dispatch

