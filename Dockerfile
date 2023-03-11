# 本次项目基本 dockerfile 配置项
# 基础镜像
#FROM amd64/nginx:1.22-perl
FROM amd64/nginx
LABEL remark="."
# 将模板文件复制到镜像中
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template
# 在容器启动时替换占位符
CMD envsubst "\$gateway_url,\$project_name" < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
# 将打包好的项目文件拷贝到容器对应位置
COPY dist /usr/share/nginx/html/platform-admin
