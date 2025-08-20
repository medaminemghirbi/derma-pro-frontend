# Backend API Fix Guide

## Error Analysis

The error occurs in `app/controllers/api/v1/doctors_controller.rb:8` where you're trying to call `admin?` method on an Admin model instance.

```ruby
NoMethodError (undefined method `admin?' for #<Admin id: "2480e207-4eda-44fc-8523-1cb6128b1750"...>)
```

## Root Cause

The issue is that you're trying to call `admin?` method on an `Admin` object, but this method doesn't exist on the Admin model.

## Solutions

### Option 1: Check user_type attribute instead

If your Admin model has a `user_type` attribute, use that instead:

```ruby
# In app/controllers/api/v1/doctors_controller.rb
def index
  if current_user.user_type == 0  # Assuming 0 means admin
    @doctors = Doctor.all
    render json: @doctors
  else
    render json: { error: "Unauthorized" }, status: :unauthorized
  end
end
```

### Option 2: Add admin? method to Admin model

Add this method to your Admin model:

```ruby
# In app/models/admin.rb
class Admin < ApplicationRecord
  def admin?
    true  # Admin instances are always admins
  end
end
```

### Option 3: Check the class type instead

```ruby
# In app/controllers/api/v1/doctors_controller.rb
def index
  if current_user.is_a?(Admin)
    @doctors = Doctor.all
    render json: @doctors
  else
    render json: { error: "Unauthorized" }, status: :unauthorized
  end
end
```

### Option 4: Use a polymorphic approach

If you have different user types (Admin, Doctor, Patient), consider using a polymorphic approach:

```ruby
# In app/models/admin.rb
class Admin < ApplicationRecord
  def role
    'admin'
  end
  
  def admin?
    true
  end
end

# In app/models/doctor.rb  
class Doctor < ApplicationRecord
  def role
    'doctor'
  end
  
  def admin?
    false
  end
end

# In app/controllers/api/v1/doctors_controller.rb
def index
  if current_user.admin?
    @doctors = Doctor.all
    render json: @doctors
  else
    render json: { error: "Unauthorized" }, status: :unauthorized
  end
end
```

## Recommended Fix

Based on your error message showing `user_type: 0`, I recommend **Option 1**:

```ruby
# In app/controllers/api/v1/doctors_controller.rb
class Api::V1::DoctorsController < ApplicationController
  before_action :authorize_request
  
  def index
    # Check if current user is admin (user_type 0)
    if current_user.user_type == 0
      @doctors = User.where(user_type: 1) # Assuming 1 is doctor type
      render json: @doctors
    else
      render json: { error: "Access denied. Admin privileges required." }, status: :forbidden
    end
  rescue => e
    render json: { error: e.message }, status: :internal_server_error
  end
end
```

## Additional Improvements

### 1. Add proper error handling

```ruby
def index
  begin
    authorize_admin_access
    @doctors = fetch_doctors
    render json: format_doctors_response(@doctors)
  rescue => e
    handle_error(e)
  end
end

private

def authorize_admin_access
  unless current_user&.user_type == 0
    raise StandardError, "Access denied. Admin privileges required."
  end
end

def fetch_doctors
  User.where(user_type: 1, is_archived: false)
end

def format_doctors_response(doctors)
  doctors.map do |doctor|
    {
      id: doctor.id,
      email: doctor.email,
      firstname: doctor.firstname,
      lastname: doctor.lastname,
      specialty: doctor.specialty,
      license_number: doctor.license_number,
      # Add other relevant fields
    }
  end
end

def handle_error(error)
  case error.message
  when /Access denied/
    render json: { error: error.message }, status: :forbidden
  else
    render json: { error: "Internal server error" }, status: :internal_server_error
  end
end
```

### 2. Add logging for debugging

```ruby
def index
  Rails.logger.info "DoctorsController#index called by user: #{current_user.id}"
  Rails.logger.info "User type: #{current_user.user_type}"
  
  # Rest of your code...
end
```

## Testing the Fix

After implementing the fix, test it with:

```bash
# In your Rails backend
rails console

# Test user type checking
user = User.find("2480e207-4eda-44fc-8523-1cb6128b1750")
puts user.user_type
puts user.class.name

# Test the query
doctors = User.where(user_type: 1)
puts doctors.count
```

## Frontend Integration

Your frontend AdminService is already properly configured:

```typescript
getDoctors() {
  return this.http.get(`${environment.urlBackend}` + 'api/v1/doctors/');
}
```

This should work once the backend issue is fixed.

## Summary

1. **Fix the backend** using Option 1 (check user_type instead of calling admin?)
2. **Add proper error handling** for better debugging
3. **Test the API endpoint** before using it in frontend
4. **Update frontend** if needed based on the new response format

The frontend is already clean and properly connected - the issue is purely on the backend side.
