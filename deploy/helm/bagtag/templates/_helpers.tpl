{{- define "bagtag.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "bagtag.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s" (include "bagtag.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "bagtag.labels" -}}
app.kubernetes.io/name: {{ include "bagtag.name" . }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}

{{- define "bagtag.selectorLabels" -}}
app.kubernetes.io/name: {{ include "bagtag.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}

{{- define "bagtag.apiServiceName" -}}
{{- .Values.api.service.name -}}
{{- end -}}

{{- define "bagtag.webServiceName" -}}
{{- .Values.web.service.name -}}
{{- end -}}

{{- define "bagtag.postgresServiceName" -}}
{{- .Values.postgres.service.name -}}
{{- end -}}

{{- define "bagtag.databaseHost" -}}
{{- if .Values.postgres.enabled -}}
{{- include "bagtag.postgresServiceName" . -}}
{{- else -}}
{{- required "externalDatabase.host is required when postgres.enabled=false" .Values.externalDatabase.host -}}
{{- end -}}
{{- end -}}

{{- define "bagtag.databaseName" -}}
{{- if .Values.postgres.enabled -}}
{{- .Values.postgres.auth.database -}}
{{- else -}}
{{- .Values.externalDatabase.database -}}
{{- end -}}
{{- end -}}

{{- define "bagtag.databaseUser" -}}
{{- if .Values.postgres.enabled -}}
{{- .Values.postgres.auth.username -}}
{{- else -}}
{{- .Values.externalDatabase.username -}}
{{- end -}}
{{- end -}}

{{- define "bagtag.databasePassword" -}}
{{- if .Values.postgres.enabled -}}
{{- .Values.postgres.auth.password -}}
{{- else -}}
{{- required "externalDatabase.password is required when postgres.enabled=false" .Values.externalDatabase.password -}}
{{- end -}}
{{- end -}}

{{- define "bagtag.magicLinkBaseUrl" -}}
{{- if .Values.api.magicLinkBaseUrl -}}
{{- .Values.api.magicLinkBaseUrl -}}
{{- else -}}
{{- printf "https://%s/login" .Values.ingress.host -}}
{{- end -}}
{{- end -}}
