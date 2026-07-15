package co.entornosseguros.auth.web;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import co.entornosseguros.auth.service.AuthService;
import co.entornosseguros.auth.web.dto.AdminUserResponse;
import co.entornosseguros.auth.web.dto.CreateAdminUserRequest;
import co.entornosseguros.auth.web.dto.UpdateAdminUserRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/users")
@Validated
public class UserAdminController {

    private final AuthService authService;

    public UserAdminController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public List<AdminUserResponse> getAllActiveUsers() {
        return authService.getActiveUsers();
    }

    @GetMapping("/{id}")
    public AdminUserResponse getById(@PathVariable Long id) {
        return authService.getUserById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AdminUserResponse create(@Valid @RequestBody CreateAdminUserRequest request) {
        return authService.createAdminUser(request);
    }

    @PutMapping("/{id}")
    public AdminUserResponse update(@PathVariable Long id, @Valid @RequestBody UpdateAdminUserRequest request) {
        return authService.updateAdminUser(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        authService.deactivateUser(id);
    }
}
