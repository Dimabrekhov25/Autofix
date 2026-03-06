FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["src/Autofix.Api/Autofix.Api.csproj", "src/Autofix.Api/"]
COPY ["src/Autofix.Application/Autofix.Application.csproj", "src/Autofix.Application/"]
COPY ["src/Autofix.Domain/Autofix.Domain.csproj", "src/Autofix.Domain/"]
COPY ["src/Autofix.Infrastructure/Autofix.Infrastructure.csproj", "src/Autofix.Infrastructure/"]
RUN dotnet restore "src/Autofix.Api/Autofix.Api.csproj"
COPY . .
WORKDIR "/src/src/Autofix.Api"
RUN dotnet build "./Autofix.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Autofix.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Autofix.Api.dll"]
