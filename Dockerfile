# 本次项目基本dockerfile配置项
# 基础镜像
FROM nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf
# 将打包好的项目文件拷贝到容器对应位置s
COPY dist /usr/share/nginx/html

