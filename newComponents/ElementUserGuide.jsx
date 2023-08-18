import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  Typography,
} from '@mui/material';

const ElementUserGuide = ({open, handleClose, shapeType}) => {
  const guide = {
    setParams: [
      'Begin your IVR flow with the setParams block. This block establishes global parameters to initiate the flow.',
      'The parameter list comprises all call parameters alongside their default values. To modify a parameter, select and adjust its value. Remember to click the "save" button next to the modified parameter to log the change.',
      'To incorporate variables within the parameter list, prefix the desired variable with a "$" symbol.',
      'Only variables defined within the variable manager are valid here.',
    ],
    playMessage: [
      'The playMessage block lets you play multiple items simultaneously.',
      'To append items to the message list, head to the message list tab, pick the object type, and hit the "add" button.',
      'The parameters tab offers two optional settings:',
      'interruptible: This determines if user input can pause the message playback. Set to "false" for uninterrupted playback.',
      'repeatOption: Designate a digit that, when pressed, replays the current message.',
      'Ensure message compatibility with its type. Any inconsistencies will be highlighted. For each message item, use the useVariable switch to incorporate matching predefined variables.',
    ],
    getDigits: [
      'Utilize the getDigits block to gather digits from the user, like phone or account numbers.',
      "The result variable captures the user's input. Define all variables in the setVariables block before deploying them here.",
      'In the message list tab, you can introduce a message by selecting its type and pressing the add button.',
      'The parameters tab demands two crucial settings: minDigits and maxDigits.',
      'minDigits: This sets the fewest digits a user must input.',
      'maxDigits: This limits the most digits a user can input.',
    ],
    playConfirm: [
      'The PlayConfirm block allows you to play one or more items with confirmation. For example, it allows you to play a message and ask the user to press 1 to confirm or 2 to cancel.',
      'To integrate items to the message list, switch to the Message List tab, choose the message type, and tap the "Add" button.',
      'The Parameters tab provides four supplementary options:',
      'confirmOption: Designate a digit for user confirmation.',
      'cancelOption: Specify a digit for user cancellation.',
      'confirmPrompt: This is the playback message seeking user approval.',
      'cancelPrompt: This message inquires about user cancellation.',
    ],
    playMenu: [
      "The PlayMenu block is used to control the flow of an IVR system based on the user's choice. It can have multiple exit points.",
      'The items tab is used to add menu items for each digit.',
      'disable: If set to true (default is false), this option will not be played and the digit specified will be considered as invalid input.',
      'silent: If set to true (default is false), this option will not be played (hidden), but if the caller presses the specified digit, the flow will continue with the action specified.',
      'skip: This option is set to 0 by default. If set to 1, the first time the menu is played, this option will be hidden. From the second iteration onwards, this item will be played. This option indicates for how many iterations this option should be skipped (hidden). Please note that even though the option is hidden, the digit input is still valid.',
      "ignoreBuffer: This option is used to discard any digits pressed before the menu starts playing. If set to true, any digits entered before the menu starts will be ignored and the caller will be prompted to enter their choice again after the menu starts playing. If set to false (default), the digits entered before the menu starts will be considered as the caller's input for the menu.",
      'logDb: This option can be used to trace the actions of the caller and keep track of statistics. If set to true, the menu will be considered for statistics. If set to false (default), the menu will be ignored for statistics.',
    ],
    runScript: [
      'Use the runScript block to execute scripts and modify IVR variables.',
      "Variables, once declared in the setVariables block, can be referenced in the runScript block by prefixing with a '$''. For instance, if a variable is labeled 'marks', reference it as '$marks'.",
      "Reserve the '$' prefix for variables previously defined in the setVariables block. Auto-complete will aid in selecting system variables.",
      "To declare local variables, use 'let,' or 'const' before using them in the script.",
      'The script must be written in valid JavaScript format.',
      'Before saving, click the validate button to ensure there are no syntax errors.',
    ],
    switch: [
      'The switch block is used to control the IVR flow based on specific conditions. These conditions are determined by the values of defined variables.',
      "In order to use a variable in the runScript block, you must first declare it in the setVariables block. To reference a variable, add a '$' before the variable name. For example, if the variable is named 'balance,' you would refer to it as '$balance'.",
      "The '$' symbol should only be used to refer to variables that have already been defined in the setVariables block.",
      'To use the switch block, you must have at least two conditions, including a default condition.',
      "The condition must be a valid expression. For example, to check if a balance is greater than 5000 and set the exitPoint to 'gold' or else set it to 'silver', you would write: '$balance > 5000' as the condition, exitPoint as 'gold' and set the default exitPoint as 'silver'.",
    ],
    callAPI: [
      'The callAPI block is used to query an API and set the output variables.',
      'Before using the callAPI block, make sure all variables used by the block are defined in the setVariables block.',
      "The 'play wait message' toggle activates a standby message during API querying or ongoing operations. Configure this message via the 'waitMessage' parameter in the setParams block.",
      'Once all necessary variables have been set, use the callAPI block to query the API and set the output variables.',
    ],
    endFlow: [
      'The endFlow block is used to end an IVR flow. It offers two options: Disconnect and Transfer.',
      'Disconnect(red): This option will end the call flow and disconnect the call.',
      'Transfer(green): This option will transfer the call flow to the preset transfer point.',
    ],
    jumper: [
      'The jumper block is used to transfer control flow within a program and navigate between pages. It has two types of jumpers: entry and exit.',
      "Entry(green): This is the default type. When connecting elements, you can use the entry jumper as the 'from' shape, initiating the flow. However, it cannot be utilized as the 'to' shape, which means you can't establish connections pointing towards it.",
      "Exit(orange):  This is utilized for directing the flow to a specific entry jumper that corresponds to a particular identifier (ID). Multiple exit jumpers can be connected to a single entry jumper. Unlike the entry jumper, the exit jumper can be employed as the 'to' shape, allowing you to establish connections that lead to it. Nevertheless, it cannot function as the 'from' shape, meaning you can't initiate connections starting from the exit jumper.",
    ],
  };

  const currentGuide = guide[shapeType];

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography
          sx={{
            display: 'flex',
            alignItems: 'center',
            boxShadow: 1,
            padding: '4px 8px',
            borderRadius: '8px',
            width: 'max-content',
          }}
          variant='h6'>
          <HelpCenterIcon sx={{mr: 1}} />
          {shapeType.toUpperCase()} GUIDE
        </Typography>
      </DialogTitle>
      <DialogContent sx={{pt: 0}}>
        {currentGuide && (
          <List>
            {currentGuide.map((item, i) => (
              <ListItem key={i} sx={{py: 0.5}}>
                <Typography fontSize='large' variant='body2'>
                  • {item}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ElementUserGuide;
