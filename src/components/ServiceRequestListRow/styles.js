import { StyleSheet } from 'react-native';
import Global from '../../util/globals';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Global.COLOR.BLACK,
    marginBottom: 16
  },
  dateView: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 4,
    backgroundColor: Global.COLOR.BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    color: Global.COLOR.WHITE,
    fontSize: 16
  },
  contentContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Global.COLOR.BLACK
  },
  descriptionText: {
    fontSize: 14,
    color: Global.COLOR.WARM_GREY
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Global.COLOR.BLACK
  },
  noStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Global.COLOR.WARM_GREY
  },
  chevronView: {
    marginTop: 8,
  },
  chevronImage: {
    height: 12,
    width: 12,
  }
});

export default styles
