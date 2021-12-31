package com.ph360.shae;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

//        Intent intent = new Intent(this, MainActivity.class);
        Uri data = null;
        String action = null;
        Intent currentIntent = getIntent();
        if (currentIntent != null) {
            Uri intentData = currentIntent.getData();
            if (intentData != null) {
                data = intentData;
            }

            // Get action as well.
            action = currentIntent.getAction();
        }

        Intent intent = new Intent(this, MainActivity.class);
        // Pass data and action (if available).
        if (data != null) {
            intent.setData(data);
        }
        if (action != null) {
            intent.setAction(action);
        }

        startActivity(intent);
        finish();
    }
}
