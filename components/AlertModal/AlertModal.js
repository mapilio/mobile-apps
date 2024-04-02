import {ActivityIndicator, Modal, Text, TouchableOpacity, View} from "react-native";
import {Trash} from "../../assets/svg/illustrations";
import {RFValue} from "react-native-responsive-fontsize";
import styles from './AlertModal.styles';

/**
 *  Alert Modal Component for delete confirmation and other alerts (e.g. delete, error, success)
 *
 *  @param visible {boolean} - visibility of the modal (true/false)
 *  @param title {string} - title of the modal (string)
 *  @param description {string} - description of the modal (string)
 *  @param buttons {object} - buttons of the modal (object)
 *  @param buttons.cancel {object} - cancel button of the modal (object)
 *  @param buttons.cancel.text {string} - text of the cancel button (string)
 *  @param buttons.cancel.style {object} - style of the cancel button (object)
 *  @param buttons.cancel.onPress {function} - action of the cancel button (function)
 *  @param buttons.confirm {object} - confirm button of the modal (object)
 *  @param buttons.confirm.text {string} - text of the confirm button (string)
 *  @param buttons.confirm.style {object} - style of the confirm button (object)
 *  @param buttons.confirm.onPress {function} - action of the confirm button (function)
 *  @param loading {boolean} - loading state of the modal (true/false)
 *  @returns {JSX.Element}
 *
 *  @constructor
 *
 *  @example
 *  <AlertModal
 *    visible={true}
 *    title={"Are you sure?"}
 *    description={"You will not be able to recover this file!"}
 *    loading={false}
 *    buttons={{
 *      cancel: {text: "no", style: {}, onPress: () => {}},
 *      confirm: {text: "yes", style: {}, onPress: () => {}}
 *    }}
 *  />
 */
export default ({visible, title, description, buttons, loading}) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.deleteModal}>
        <View style={styles.deleteModalContent}>

          <View style={styles.trashIcon}>
            <Trash width={RFValue(17)} height={RFValue(24)}/>
          </View>

          <Text style={styles.deleteModalTitle}>{title}</Text>
          <Text style={styles.deleteModalDescription}>{description}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              disabled={loading}
              style={styles.actionsButton}
              onPress={() => buttons.cancel.onPress()}
            >
              <Text style={styles.actionsButtonText}>{buttons.cancel.text}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={loading}
              style={{...styles.actionsButton, ...styles.deleteButton}}
              onPress={() => buttons.confirm.onPress()}
            >
              {loading && <ActivityIndicator color="#fff"/>}
              <Text style={{...styles.actionsButtonText, ...styles.deleteButtonText}}>{buttons.confirm.text}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
