import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  CircularProgress,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Cancel,
  Assessment,
} from '@mui/icons-material';

interface Decision {
  id: string;
  callsign: string;
  icao: string;
  agentDecision: 'GO' | 'CAUTION' | 'NO-GO';
  xgboostDecision: 'GO' | 'CAUTION' | 'NO-GO';
  agentConfidence: number;
  xgboostConfidence: number;
  atcDecision?: 'GO' | 'CAUTION' | 'NO-GO';
  outcome?: 'COMPLETED_SAFELY' | 'DIVERTED' | 'INCIDENT';
  createdAt: string;
  feedbackAt?: string;
}

interface DecisionHistoryProps {
  icao?: string;
  limit?: number;
}

const DecisionHistory: React.FC<DecisionHistoryProps> = ({ icao, limit = 20 }) => {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [feedbackReason, setFeedbackReason] = useState('');

  useEffect(() => {
    fetchDecisions();
  }, [icao]);

  const fetchDecisions = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (icao) params.append('icao', icao);

      const response = await fetch(`/api/decisions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch decisions');

      const data = await response.json();
      setDecisions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'GO':
        return <CheckCircle sx={{ fontSize: 20, color: '#4caf50' }} />;
      case 'CAUTION':
        return <Warning sx={{ fontSize: 20, color: '#ff9800' }} />;
      case 'NO-GO':
        return <Cancel sx={{ fontSize: 20, color: '#f44336' }} />;
      default:
        return null;
    }
  };

  const handleFeedback = async () => {
    if (!selectedDecision) return;

    try {
      const response = await fetch(`/api/decisions/${selectedDecision.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          atc_decision: selectedDecision.atcDecision,
          outcome: selectedDecision.outcome,
          outcome_reason: feedbackReason,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');

      setFeedbackDialog(false);
      fetchDecisions(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const getOutcomeColor = (outcome?: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (outcome) {
      case 'COMPLETED_SAFELY':
        return 'success';
      case 'DIVERTED':
        return 'warning';
      case 'INCIDENT':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h6" sx={{ color: '#00b4d8', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assessment /> Decision History
        </Typography>
        <Button
          variant="outlined"
          size="small"
          sx={{ borderColor: '#00b4d8', color: '#00b4d8' }}
          onClick={fetchDecisions}
        >
          Refresh
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 3 }}>
          <CircularProgress sx={{ color: '#00b4d8' }} />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            background: 'linear-gradient(135deg, #0a0e1a 0%, #1a2a3a 100%)',
            border: '1px solid #00b4d8',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ borderBottom: '2px solid #00b4d8' }}>
                <TableCell sx={{ color: '#00b4d8', fontWeight: 'bold' }}>Callsign</TableCell>
                <TableCell sx={{ color: '#00b4d8', fontWeight: 'bold' }}>ICAO</TableCell>
                <TableCell sx={{ color: '#00b4d8', fontWeight: 'bold' }}>Agent</TableCell>
                <TableCell sx={{ color: '#00b4d8', fontWeight: 'bold' }}>XGBoost</TableCell>
                <TableCell sx={{ color: '#00b4d8', fontWeight: 'bold' }}>ATC Decision</TableCell>
                <TableCell sx={{ color: '#00b4d8', fontWeight: 'bold' }}>Outcome</TableCell>
                <TableCell sx={{ color: '#00b4d8', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {decisions.map((decision) => (
                <TableRow
                  key={decision.id}
                  sx={{
                    borderBottom: '1px solid rgba(0, 180, 216, 0.1)',
                    '&:hover': { backgroundColor: 'rgba(0, 180, 216, 0.05)' },
                  }}
                >
                  <TableCell sx={{ color: '#b0e0e6' }}>{decision.callsign}</TableCell>
                  <TableCell sx={{ color: '#b0e0e6' }}>{decision.icao}</TableCell>
                  <TableCell sx={{ color: '#b0e0e6', display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getDecisionIcon(decision.agentDecision)}
                    {decision.agentDecision}
                    <Typography variant="caption" sx={{ color: '#888' }}>
                      ({(decision.agentConfidence * 100).toFixed(0)}%)
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: '#b0e0e6', display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getDecisionIcon(decision.xgboostDecision)}
                    {decision.xgboostDecision}
                    <Typography variant="caption" sx={{ color: '#888' }}>
                      ({(decision.xgboostConfidence * 100).toFixed(0)}%)
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: '#b0e0e6' }}>
                    {decision.atcDecision ? (
                      <Chip
                        label={decision.atcDecision}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor:
                            decision.atcDecision === 'GO'
                              ? '#4caf50'
                              : decision.atcDecision === 'CAUTION'
                              ? '#ff9800'
                              : '#f44336',
                          color:
                            decision.atcDecision === 'GO'
                              ? '#4caf50'
                              : decision.atcDecision === 'CAUTION'
                              ? '#ff9800'
                              : '#f44336',
                        }}
                      />
                    ) : (
                      <Typography variant="caption" sx={{ color: '#888' }}>Pending</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ color: '#b0e0e6' }}>
                    {decision.outcome ? (
                      <Chip
                        label={decision.outcome.replace(/_/g, ' ')}
                        size="small"
                        color={getOutcomeColor(decision.outcome)}
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="caption" sx={{ color: '#888' }}>N/A</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      sx={{ color: '#00b4d8' }}
                      onClick={() => {
                        setSelectedDecision(decision);
                        setFeedbackDialog(true);
                      }}
                    >
                      {decision.atcDecision ? 'View' : 'Feedback'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)}>
        <DialogTitle sx={{ backgroundColor: '#0a0e1a', color: '#00b4d8' }}>
          Provide ATC Feedback
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#0a0e1a' }}>
          {selectedDecision && (
            <>
              <Typography variant="body2" sx={{ color: '#b0e0e6', marginBottom: 2 }}>
                {selectedDecision.callsign} at {selectedDecision.icao}
              </Typography>
              <TextField
                select
                label="ATC Decision"
                defaultValue={selectedDecision.atcDecision || 'GO'}
                onChange={(e) =>
                  setSelectedDecision({
                    ...selectedDecision,
                    atcDecision: e.target.value as any,
                  })
                }
                SelectProps={{
                  native: true,
                }}
                fullWidth
                margin="normal"
                sx={{ '& .MuiOutlinedInput-root': { color: '#b0e0e6' } }}
              >
                <option value="GO">GO</option>
                <option value="CAUTION">CAUTION</option>
                <option value="NO-GO">NO-GO</option>
              </TextField>
              <TextField
                select
                label="Outcome"
                defaultValue={selectedDecision.outcome || 'COMPLETED_SAFELY'}
                onChange={(e) =>
                  setSelectedDecision({
                    ...selectedDecision,
                    outcome: e.target.value as any,
                  })
                }
                SelectProps={{
                  native: true,
                }}
                fullWidth
                margin="normal"
                sx={{ '& .MuiOutlinedInput-root': { color: '#b0e0e6' } }}
              >
                <option value="COMPLETED_SAFELY">Completed Safely</option>
                <option value="DIVERTED">Diverted</option>
                <option value="INCIDENT">Incident</option>
              </TextField>
              <TextField
                label="Reason"
                value={feedbackReason}
                onChange={(e) => setFeedbackReason(e.target.value)}
                fullWidth
                multiline
                rows={3}
                margin="normal"
                placeholder="Why did you make this decision?"
                sx={{ '& .MuiOutlinedInput-root': { color: '#b0e0e6' } }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#0a0e1a', padding: 2 }}>
          <Button
            onClick={() => setFeedbackDialog(false)}
            sx={{ color: '#00b4d8' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleFeedback}
            variant="contained"
            sx={{ backgroundColor: '#00b4d8', color: '#0a0e1a' }}
          >
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DecisionHistory;
