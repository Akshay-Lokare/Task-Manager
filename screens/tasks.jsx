import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Alert
} from 'react-native';

import Footer from '../components/footer';
import { BASE_URL } from '../components/config';

export default function Tasks({ route, navigation }) {
  const { tasks } = route.params;
  const [taskStatus, setTaskStatus] = useState(tasks.status);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/tasks/${tasks._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      navigation.navigate('MainTabs', {
        screen: 'Home',
        params: { tasks: {} }
      });

    } catch (error) {
      console.error('Error deleting task:', error);
      Alert.alert('Error', 'Failed to delete task. Please try again.');
    }
  }

  // Updating the status
  const updateTaskStatus = async () => {
    try {
      let response;
      
      if (taskStatus === 'pending') {
        // Change status to in-progress
        response = await fetch(`${BASE_URL}/api/tasks/${tasks._id}/in-progress`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json'
          }
        });
        setTaskStatus('in-progress');
      } else if (taskStatus === 'in-progress') {
        // Change status to completed
        response = await fetch(`${BASE_URL}/api/tasks/${tasks._id}/completed`, {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json'
          }
        });
        setTaskStatus('completed');
        setIsButtonDisabled(true);  // Disable the button after task is completed
      }

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', `Task status updated to ${taskStatus}`);
        console.log(`Task updated to ${taskStatus}`);
      } else {
        Alert.alert('Error', data.message || 'Failed to update task status');
        console.log(`Failed to update the task: ${data.message}`);
      }

    } catch (error) {
      console.error('An error occurred while updating the task status', error);
      Alert.alert('Error', 'An error occurred while updating the task status');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{tasks.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(taskStatus) }]}>
            <Text style={styles.statusText}>{taskStatus}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{tasks.description || 'No description provided'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Category</Text>
              <Text style={styles.value}>{tasks.category || 'No Category'}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailRow}>
              <Text style={styles.label}>Due Date</Text>
              <Text style={styles.value}>{new Date(tasks.dueDate).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.updateButton} 
            onPress={updateTaskStatus} 
            disabled={isButtonDisabled}
          >
            <Text style={styles.updateButtonText}>
              {taskStatus === 'pending' ? 'In-Progress' : 'Completed'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </SafeAreaView>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return '#4CAF50';
    case 'in-progress':
      return '#2196F3';
    case 'overdue':
      return '#f44336';
    case 'pending':
      return '#FFA726';
    default:
      return '#757575';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? 30 : 10,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginLeft: 65,
    textShadowColor: 'pink',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 10,
    marginTop: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: '#e0e0e0',
  },
  detailsContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  updateButton: {
    backgroundColor: 'cyan',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});
