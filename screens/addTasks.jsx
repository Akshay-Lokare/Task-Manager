import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Platform, 
  Alert,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';

import Toast from '../components/Toast';
import { BASE_URL } from '../components/config';
import Footer from '../components/footer';

import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';


export default function AddTasks({ route }) {

  const username = route.params;

  const setDefaultTime = (date) => {
    const newDate = new Date(date);
    newDate.setHours(22, 24, 0, 0); // Sets time to 12:05:00 AM
    return newDate;
  };

  const navigation = useNavigation();
  
  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    category: '',
    dueDate: setDefaultTime(new Date()),
    reminderDate: setDefaultTime(new Date()),
    status: 'pending'
  });

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isTestButtonDisabled, setIsTestButtonDisabled] = useState(false);

  // here we are getting the permission for the push notifications
  useEffect(() => {
    registerForPushNotificationsAsync();
    
    // Configure notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        // Check if user has granted permission before showing notifications
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          return {
            shouldShowAlert: false,
            shouldPlaySound: false,
            shouldSetBadge: false,
          };
        }
        
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        };
      },
    });
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        setToastMessage('Failed to get push token for push notification!');
        setToastVisible(true);
        return;
      }
    }
  };


  //This is like setting an alarm - 
  //it tells the phone "At this specific date and time, show this message".
  const scheduleNotification = async (date, title, body) => {
    try {
      const trigger = new Date(date);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
        },
        trigger,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const showDatePicker = (currentDate, field, mode = 'date') => {
    const showTimePicker = () => {
      DateTimePickerAndroid.open({
        value: currentDate,
        onChange: (event, selectedDate) => {
          if (event.type === 'set') {
            // If no time was previously set, use default time
            const finalDate = selectedDate || setDefaultTime(currentDate);
            setTaskData(prev => ({
              ...prev,
              [field]: finalDate
            }));
          }
        },
        mode: 'time',
      });
    };

    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (event, selectedDate) => {
        if (event.type === 'set') {
          const finalDate = selectedDate || currentDate;
          setTaskData(prev => ({
            ...prev,
            [field]: finalDate
          }));
          showTimePicker();
        }
      },
      mode: 'date',
    });
  };

  const handleSubmit = async () => {
    try {
      if (!taskData.name) {
        setToastMessage('Task name is required');
        setToastVisible(true);
        return;
      }

      // Schedule notifications for due date and reminder
      await scheduleNotification(
        taskData.dueDate,
        'Task Due!',
        `Your task "${taskData.name}" is due now!`
      );

      await scheduleNotification(
        taskData.reminderDate,
        'Task Reminder',
        `Reminder: Your task "${taskData.name}" is coming up!`
      );

      console.log(`⭐ baseUrl: ${BASE_URL}`);
      console.log('📝 Submitting new task...');
      console.log('📍 Endpoint:', `${BASE_URL}/api/tasks`);
      console.log('📦 Task data:', JSON.stringify(taskData, null, 2));

      const response = await fetch(`${BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      console.log('🔄 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Task created successfully:', JSON.stringify(data, null, 2));

      setToastMessage('Task created successfully');
      setToastVisible(true);
      
      setTaskData({
        name: '',
        description: '',
        category: '',
        dueDate: new Date(),
        reminderDate: new Date(),
        status: 'pending'
      });
      console.log('🔄 Form reset complete');

    } catch (error) {
      console.error('❌ Error details:', error);
      setToastMessage('Failed to create task. Please check your connection.');
      setToastVisible(true);
    }
  };


  const testNotification = async () => {
    try {
      setIsTestButtonDisabled(true);
      const COUNTDOWN_SECONDS = 3;
      setCountdown(COUNTDOWN_SECONDS);

      // Start countdown
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsTestButtonDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Schedule notification
      const testDate = new Date(Date.now() + COUNTDOWN_SECONDS * 1000);
      await scheduleNotification(
        testDate,
        'Test Notification!',
        'This is a test notification that appears 3 seconds after clicking the button.'
      );
      
      setToastMessage('Test notification scheduled');
      setToastVisible(true);
    } catch (error) {
      console.error('Test notification error:', error);
      setToastMessage('Failed to schedule test notification');
      setToastVisible(true);
      setIsTestButtonDisabled(false);
      setCountdown(0);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Add New Task</Text>
            
            <TextInput 
              placeholder='Task Name'
              style={styles.input}
              placeholderTextColor="#666"
              value={taskData.name}
              onChangeText={(text) => setTaskData(prev => ({ ...prev, name: text }))}
            />
            
            <TextInput 
              placeholder='Task Description'
              style={[styles.input, styles.textArea]}
              multiline={true}
              numberOfLines={4}
              placeholderTextColor="#666"
              value={taskData.description}
              onChangeText={(text) => setTaskData(prev => ({ ...prev, description: text }))}
            />
            
            <TextInput 
              placeholder='Category'
              style={styles.input}
              placeholderTextColor="#666"
              value={taskData.category}
              onChangeText={(text) => setTaskData(prev => ({ ...prev, category: text }))}
            />

            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => showDatePicker(taskData.dueDate, 'dueDate')}
            >
              <Text style={styles.dateLabel}>Due Date</Text>
              <Text style={styles.dateText}>
                {taskData.dueDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => showDatePicker(taskData.reminderDate, 'reminderDate')}
            >
              <Text style={styles.dateLabel}>Reminder Date</Text>
              <Text style={styles.dateText}>
                {taskData.reminderDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.addButton, 
                { 
                  marginTop: 10, 
                  backgroundColor: isTestButtonDisabled ? '#cccccc' : '#4CAF50'
                }
              ]}
              onPress={testNotification}
              disabled={isTestButtonDisabled}
            >
              <Text style={styles.addButtonText}>
                {isTestButtonDisabled 
                  ? `Test Notification (${countdown}s)` 
                  : 'Test Notification (3s)'}
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
      <Footer />
      <Toast 
        visible={toastVisible}
        message={toastMessage}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',

  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateInput: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#6c63ff', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

