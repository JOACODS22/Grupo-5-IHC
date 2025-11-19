# Funcionalidad de Editar Nombre de Usuario

## Descripción
Se ha implementado la funcionalidad para que los usuarios puedan editar y actualizar su nombre de usuario desde la página de perfil (perfil_usuario.html).

## Características Implementadas

### 1. Modal de Edición
- **Botón "Editar perfil"**: Al hacer clic, se abre un modal elegante para editar el nombre
- **Pre-llenado**: El modal muestra el nombre actual del usuario
- **Validación**: Se valida que el nombre no esté vacío y tenga al menos 2 caracteres

### 2. Actualización en Tiempo Real
- El nombre se actualiza inmediatamente en:
  - El saludo de la página ("Hola, [Nombre]")
  - El título del perfil
  - El header (dropdown de usuario)
- Los cambios persisten en localStorage

### 3. Persistencia de Datos
- El nuevo nombre se guarda en localStorage
- El cambio afecta a todos los usuarios registrados en el sistema
- El nombre actualizado se mantiene después de cerrar sesión y volver a iniciar

## Archivos Modificados

### 1. `page/perfil_usuario.html`
- **Agregado**: Modal HTML para editar nombre
- **Modificado**: Botón "Editar perfil" ahora abre el modal
- **Agregado**: JavaScript para manejar el modal y la actualización

### 2. `js/app.js`
- **Agregado**: Método `updateUserName()` en SessionManager
- Este método actualiza el nombre del usuario activo en localStorage

### 3. `css/perfil_usuario.css`
- **Agregado**: Estilos completos para el modal
- Diseño responsive y animaciones suaves
- Estilos para formulario, botones y mensajes de error

## Flujo de Usuario

1. Usuario inicia sesión
2. Navega a su perfil (perfil_usuario.html)
3. Hace clic en "Editar perfil"
4. Se abre un modal con su nombre actual
5. Ingresa el nuevo nombre
6. Hace clic en "Guardar"
7. El nombre se actualiza en toda la interfaz
8. El cambio se guarda permanentemente

## Validaciones

- **Campo vacío**: No permite nombres vacíos
- **Longitud mínima**: El nombre debe tener al menos 2 caracteres
- **Mensajes de error**: Se muestran mensajes claros en caso de error

## Características de UX

- **Animaciones**: Transiciones suaves al abrir/cerrar el modal
- **Cerrar modal**: Se puede cerrar con:
  - Botón X (esquina superior derecha)
  - Botón "Cancelar"
  - Click fuera del modal
- **Feedback visual**: Mensaje de éxito al actualizar
- **Pre-llenado**: Muestra el nombre actual para facilitar la edición

## Compatibilidad

- Funciona con el sistema de múltiples usuarios
- Compatible con el sistema de sesiones existente
- Responsive: funciona en desktop y móviles

## Ejemplo de Uso

```javascript
// El método updateUserName se puede llamar desde cualquier lugar
SessionManager.updateUserName("Nuevo Nombre");
```

## Notas Técnicas

- Los datos se almacenan en `localStorage.usuarios` (array de usuarios)
- El usuario activo se identifica por su email en `localStorage.usuarioActivo`
- La actualización es atómica: solo afecta al usuario activo
- El header se actualiza automáticamente mediante `HeaderManager.updateHeader()`

