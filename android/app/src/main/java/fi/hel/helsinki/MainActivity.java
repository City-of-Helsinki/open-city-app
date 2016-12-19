package fi.hel.helsinki;

import com.facebook.react.ReactActivity;
import io.realm.react.RealmReactPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.github.xfumihiro.react_native_image_to_base64.ImageToBase64Package;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "OpenCity";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RealmReactPackage(),
            new ImageToBase64Package(),
            new ImageResizerPackage(),
            new MapsPackage(this),
            new ReactNativeLocalizationPackage(),
            new ImagePickerPackage()
        );
    }
}
