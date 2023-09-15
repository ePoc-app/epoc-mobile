package fr.inria.epoc;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import co.fitcom.capacitor.ZipPlugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(ZipPlugin.class);
    super.onCreate(savedInstanceState);

  }
}
