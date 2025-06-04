<?php
session_start();

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'vacation_saathi';

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    $stmt = $conn->prepare("SELECT id, name, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows == 1) {
        $stmt->bind_result($id, $name, $hashed_password);
        $stmt->fetch();

        if (password_verify($password, $hashed_password)) {
            // Set session variables
            $_SESSION['user_id'] = $id;
            $_SESSION['user_name'] = $name;

            // Redirect to home page
            header("Location: travel.html");
            exit();
        } else {
            echo "Invalid password.";
        }
    } else {
        echo "No user found with that email.";
    }

    $stmt->close();
    $conn->close();
} 
?>


<!-- Include the same HTML layout as the image with Login form active -->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login - Vacation Saathi</title>
  <link rel="stylesheet" href="Travel.css">
</head>
<body>
  <div class="container">
    <div class="left">
      <h1>Welcome to Vacation<br>Saathi</h1>
      <ul>
        <li>✈️ Create your free account today and unlock the full journey experience!</li>
        <li>✓ Report your lost travel essentials quickly and easily</li>
        <li>✓ Get instant alerts when someone finds your belongings</li>
        <li>✓ Chat securely with finders and reunite faster</li>
        <li>✓ Keep track of your lost and found travel history</li>
        <li>✓ Join a global community of travelers helping travelers</li>
      </ul>
    </div>

    <div class="right">
      <h2>Login</h2>
      <form method="POST" action="login.php">
        <label>Email Address</label>
        <input type="email" name="email" required>

        <label>Password</label>
        <input type="password" name="password" required>

        <div class="remember">
          <input type="checkbox"> Remember me
        </div>
        <button type="submit" ><a href="travel.html">Login</a>
        </button>
        <a href="#">Forgot Password?</a>
        <p style="margin-top: 20px;">Don't have an account? <a href="register.php">Register here</a></p>
      </form>
    </div>
  </div>
</body>
</html>