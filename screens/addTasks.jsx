import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Footer from '../components/footer';

export default function AddTasks() {
  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    category: '',
    dueDate: new Date(),
    reminderDate: new Date(),
  });

  const showDatePicker = (currentDate, field, mode = 'date') => {
    DateTimePickerAndroid.open({
      value: currentDate,
      onChange: (event, selectedDate) => {
        if (event.type === 'set') {
          setTaskData(prev => ({
            ...prev,
            [field]: selectedDate
          }));
        }
      },
      mode: mode,
    });
  };

  const handleSubmit = async () => {
    try {
      if (!taskData.name) {
        Alert.alert('Error', 'Task name is required');
        return;
      }

      // Use a direct URL to your backend
      const baseUrl = 'http://192.168.1.10:5000';  // Your IP here

      console.log('📝 Submitting new task...');
      console.log('📍 Endpoint:', `${baseUrl}/api/tasks`);
      console.log('📦 Task data:', JSON.stringify(taskData, null, 2));

      const response = await fetch(`${baseUrl}/api/tasks`, {
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

      Alert.alert('Success', 'Task created successfully');
      setTaskData({
        name: '',
        description: '',
        category: '',
        dueDate: new Date(),
        reminderDate: new Date(),
      });
      console.log('🔄 Form reset complete');

    } catch (error) {
      console.error('❌ Error details:', error);
      Alert.alert('Error', 'Failed to create task. Please check your connection.');
    }
  };

  return (
    <View style={styles.container}>
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
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
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
    backgroundColor: '#6c63ff', // A nice purple color
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

