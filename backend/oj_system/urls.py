"""
URL configuration for oj_system project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # 🎯 Include API namespace for the problem app
    path('api/', include('problem.urls')),
    path('api/', include('account.urls')),
    path('api/', include('submission.urls')),

    # 🎯 New Authentication Endpoints
    # 1. Login (Obtain Access and Refresh Tokens)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # 2. Refresh Token (Renew Access Token)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
